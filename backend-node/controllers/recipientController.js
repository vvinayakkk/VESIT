const express = require('express');
const mongoose = require('mongoose');
const FoodRequest = require('../models/foodReq');
const Recipient = require('../models/recipients');
const FoodListing = require('../models/foodListing');

const RequestFood = async (req, res) => {
    try {
        const { food_category, quantity_needed, urgency_level, status, recipient_id } = req.body;

        // Input validation
        if (!food_category || !quantity_needed || !urgency_level || !recipient_id) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate quantity is positive
        if (quantity_needed <= 0) {
            return res.status(400).json({ message: 'Quantity must be positive' });
        }

        const newRequest = new FoodRequest({ 
            food_category, 
            quantity_needed, 
            urgency_level, 
            status: status || 'pending', // Default status if not provided
            recipient_id
        });

        
        const result = await newRequest.save();
        await Recipient.findByIdAndUpdate(recipient_id, { $push: { donations: newRequest._id } });
        

        res.status(201).json({
            success: true,
            data: result,
            message: 'Food request created successfully'
        });
    } catch (err) {
        console.error('Error creating food request:', err);
        res.status(500).json({ 
            success: false,
            message: 'Error creating food request',
            error: err.message 
        });
    }
}
const claimFood = async (req, res) => {
    try{
        const {id} = req.params;
        const list = await FoodListing.find({_id: id});
        if(!list || list.length === 0){
            return res.status(404).json({ message: 'Food listing not found' });
        }
        const request = await FoodListing.findByIdAndUpdate(id, {status: 'pending'});

        res.status(200).json({ message: 'Food claimed successfully', data: request });
    }catch(e){
        console.error('Error claiming food:', e);
        res.status(500).json({ message: 'Error claiming food', error: e.message });
    }
}
const getFoodReq = async(req, res) => {
    try {
        const {id} = req.params; 
        const list = await FoodRequest.find({ recipient_id: id });
        res.status(200).json({ message: 'Food requests fetched successfully', data: list });
    }catch(e){
        console.error('Error fetching food requests:', e);
        res.status(500).json({ message: 'Error fetching food requests', error: e.message });
    }
}
const cancelRequest = async (req, res) => {
    try {
        const request = await FoodRequest.findByIdAndDelete(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.status(200).json({ message: 'Request cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRecipientProfile = async (req, res) => {
    try {
        const recipient = await Recipient.findById(req.params.id);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }
        res.status(200).json({ recipient });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRecipientProfile = async (req, res) => {
    try {
        const updates = req.body;
        delete updates.password;
        
        const recipient = await Recipient.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        );
        
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }
        
        res.status(200).json({ recipient });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { RequestFood, claimFood, getFoodReq, cancelRequest, getRecipientProfile, updateRecipientProfile };
