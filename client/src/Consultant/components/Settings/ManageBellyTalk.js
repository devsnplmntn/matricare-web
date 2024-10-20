import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import SaveAlt from '@mui/icons-material/SaveAlt';
import "../../styles/settings/managebellytalk.css";
import { jsPDF } from 'jspdf';

// Example data for the chart
const data = [
  { name: 'Health & Wellness', Posts: 20, Engagement: 10, Discussions: 5 },
  { name: 'Finance & Budgeting', Posts: 15, Engagement: 5, Discussions: 3 },
  { name: 'Parenting & Family', Posts: 8, Engagement: 4, Discussions: 2 },
  { name: 'Baby Essentials', Posts: 5, Engagement: 12, Discussions: 8 },
  { name: 'Exercise & Fitness', Posts: 28, Engagement: 10, Discussions: 25 },
  { name: 'Labor & Delivery', Posts: 25, Engagement: 15, Discussions: 7 },
];

const ManageBellyTalk = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [open, setOpen] = useState(false);
  
    const handleCardClick = (category) => {
      setSelectedCategory(category);
      setOpen(true);  // Open the modal when a card is clicked
    };
  
    const handleClose = () => {
      setOpen(false);  // Close the modal
      setSelectedCategory(null);  // Reset selected category
    };
  
    const renderDetails = () => {
      if (!selectedCategory) return null;
  
      const categoryData = data.find(item => item.name === selectedCategory);
  
      if (!categoryData) return null;
  
      return (
        <>
          <Typography>Posts: {categoryData.Posts}</Typography>
          <Typography>Engagement: {categoryData.Engagement}</Typography>
          <Typography>Discussions: {categoryData.Discussions}</Typography>
        </>
      );
    };

    const handleDownload = () => {
        const categoryData = data.find(item => item.name === selectedCategory);
        if (!categoryData) return;
  
        // Create a new jsPDF instance
        const doc = new jsPDF();
  
        // Set the title and add content
        doc.setFontSize(22);
        doc.text(`Download Data for ${selectedCategory}`, 20, 20);
        doc.setFontSize(16);
        doc.text(`Posts: ${categoryData.Posts}`, 20, 40);
        doc.text(`Engagement: ${categoryData.Engagement}`, 20, 50);
        doc.text(`Discussions: ${categoryData.Discussions}`, 20, 60);
        
        // Save the PDF
        doc.save(`${selectedCategory}_data.pdf`);
      };

  return (
    <Box className="manage-bellytalk-container">
        <Box className="manage-bellytalk-main-container">
        <h2>BellyTalk Dashboard</h2>
      
        <div className="manage-bellytalk-category-cards">
          <div className="manage-bellytalk-category-card health" onClick={() => handleCardClick('Health & Wellness')}>Health & Wellness</div>
          <div className="manage-bellytalk-category-card finance" onClick={() => handleCardClick('Finance & Budgeting')}>Finance & Budgeting</div>
          <div className="manage-bellytalk-category-card parenting" onClick={() => handleCardClick('Parenting & Family')}>Parenting & Family</div>
          <div className="manage-bellytalk-category-card essentials" onClick={() => handleCardClick('Baby Essentials')}>Baby's Essentials</div>
          <div className="manage-bellytalk-category-card exercise" onClick={() => handleCardClick('Exercise & Fitness')}>Exercise & Fitness</div>
          <div className="manage-bellytalk-category-card labor" onClick={() => handleCardClick('Labor & Delivery')}>Labor & Delivery</div>
        </div>
      
      {/* Recharts Bar Graph */}
      <Box className="manage-bellytalk-chart">
        <Typography variant="h5">Category Engagement Overview</Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Posts" fill="#9DC3E2" />
            <Bar dataKey="Engagement" fill="#e39fa9" />
            <Bar dataKey="Discussions" fill="#9a6cb4af" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">{selectedCategory}</Typography>
          <IconButton onClick={handleDownload} sx={{ color: '#7c459c' }}>
            <SaveAlt   />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {renderDetails()}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ color: '#7c459c', textAlign: 'center' }}>Close</Button>
      </DialogActions>
    </Dialog>
    </Box>
  );
};

export default ManageBellyTalk;
