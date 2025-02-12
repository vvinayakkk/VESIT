const express = require('express');
const mongoose = require('mongoose');
const FoodListing = require('../models/foodListing');

const getAllListing = async(req, res) => {
    try {
        const foodListings = await FoodListing.find({ status : 'Available' });
        res.json(foodListings);
    } catch (error) {
        console.error('Error fetching available listings:', error);
        res.status(500).json({ message: 'Error fetching available listings' });
    }
};

module.exports = { getAllListing };
