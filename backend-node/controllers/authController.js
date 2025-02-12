const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Donor = require('../models/donor');
const Recipient = require('../models/recipients');
const DeliveryAgent = require('../models/deliveryAgent');
const User = require('../models/user');

const register = async (req, res) => {
 try {
   const { name, email, phone_number, address, role, password } = req.body;

   if (!name || !email || !phone_number || !address || !role || !password) {
     return res.status(400).json({ message: 'All fields are required' });
   }

   let Model = getModel(role);
   if (!Model) return res.status(400).json({ message: 'Invalid role' });

   const existingUser = await Model.findOne({ email });
   if (existingUser) {
     return res.status(400).json({ message: 'Email already exists' });
   }

   const hashedPassword = await bcrypt.hash(password, 10);
   const user = await Model.create({
     name, email, phone_number, address, role, password: hashedPassword
   });
   await user.save();
   return res.status(201).json({ message: 'Registration successful' });
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
};

const login = async (req, res) => {
 try {
   const { email, password, role } = req.body;

   if (!email || !password || !role) {
     return res.status(400).json({ message: 'All fields required' });
   }

   let Model = getModel(role);
   if (!Model) return res.status(400).json({ message: 'Invalid role' });

   const user = await Model.findOne({ email });
   if (!user || !(await bcrypt.compare(password, user.password))) {
     return res.status(401).json({ message: 'Invalid credentials' });
   }

   const token = jwt.sign({
     id: user._id,
     name: user.name,
     email: user.email,
     role: user.role,
     address: user.address,
     phone_number: user.phone_number,
   }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

   res.cookie('jwt', token, {
     httpOnly: true,
     sameSite: 'strict',
     maxAge: 24 * 60 * 60 * 1000 // 1 day
   });

   res.status(200).json({
     user: {
       id: user._id,
       name: user.name,
       address: user.address,
       email: user.email,
       role: user.role,
       phone_number: user.phone_number,
       token
     }
   });

 } catch (error) {
   res.status(500).json({ message: error.message });
 }
};

const getModel = (role) => {
 const models = {
   'Donor': Donor,
   'Recipient': Recipient,
   'Delivery Agent': DeliveryAgent,
   'Household': User,
 };
 return models[role];
};

module.exports = { register, login };