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

const acceptPickup = async (req, res) => {
    try {
        const listing = await FoodListing.findByIdAndUpdate(
            req.params.id,
            { 
                status: 'In Transit',
                delivery_agent: req.user.id
            },
            { new: true }
        );
        
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        
        res.status(200).json({ listing });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDeliveryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const listing = await FoodListing.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!listing) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        
        res.status(200).json({ listing });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAgentDeliveries = async (req, res) => {
    try {
        const deliveries = await FoodListing.find({
            delivery_agent: req.params.agentId,
            status: 'In Transit'
        });
        res.status(200).json({ deliveries });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDeliveryHistory = async (req, res) => {
    try {
        const deliveries = await FoodListing.find({
            delivery_agent: req.params.agentId,
            status: 'Delivered'
        });
        res.status(200).json({ deliveries });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllListing, acceptPickup, updateDeliveryStatus, getAgentDeliveries, getDeliveryHistory };
