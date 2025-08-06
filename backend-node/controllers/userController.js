const express = require('express');
const mongoose = require('mongoose');
const FoodListing = require('../models/foodListing');
const User = require('../models/user');

const donate = async (req, res) => {
    try {
        const { donor_id, food_name, category, quantity, unit, pickup_location, expiry_date, status } = req.body;

        // Validate donor ID
        const donor = await User.findById(donor_id);
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' });
        }

        // Create new food listing
        const donation = new FoodListing({
            donor_id,
            food_name,
            category,
            quantity,
            unit,
            pickup_location,
            expiry_date,
            status
        });

        // Save the donation
        const savedDonation = await donation.save();

        // Update the donor's document by adding the listing reference
        await User.findByIdAndUpdate(donor_id, { $push: { donations: savedDonation._id } });

        return res.status(201).json({ message: 'Food donation added successfully', donation: savedDonation });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
};
const getUserFoodListings = async (req, res) => {
    try {
        const id = req.params.id;
        // Find the user first to ensure they exist
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch all food listings by this user
        const foodListings = await FoodListing.find({ donor_id: id })
            .sort({ createdAt: -1 }); // Sort by newest first

        return res.status(200).json({
            success: true,
            listings: foodListings
        });

    } catch (error) {
        console.error('Error fetching food listings:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching food listings',
            error: error.message
        });
    }
};
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        delete updates.password; // Prevent password update through this route
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        );
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { donate, getUserFoodListings, getProfile, updateProfile, deleteProfile };
