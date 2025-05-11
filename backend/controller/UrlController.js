import Url from '../models/Url.js';
import { nanoid } from 'nanoid';

export const shortenUrl = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log
    
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing' });
    }

    const { originalUrl } = req.body;
    
    if (!originalUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Basic URL validation
    try {
      new URL(originalUrl);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const shortId = nanoid(6);
    const newUrl = await Url.create({ shortId, originalUrl });
    res.json({ shortUrl: `${process.env.BASE_URL}/${shortId}` });
  } catch (error) {
    console.error('Error in shortenUrl:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { shortId } = req.params;
    const urlEntry = await Url.findOne({ shortId });

    if (!urlEntry) return res.status(404).send('URL not found');

    // Log click
    urlEntry.clicks.push({
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
    await urlEntry.save();

    res.redirect(urlEntry.originalUrl);
  } catch (error) {
    console.error('Error in redirectUrl:', error);
    res.status(500).send('Internal server error');
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { shortId } = req.params;
    const urlEntry = await Url.findOne({ shortId });

    if (!urlEntry) return res.status(404).send('Not found');
    
    res.json({
      totalClicks: urlEntry.clicks.length,
      clicks: urlEntry.clicks
    });
  } catch (error) {
    console.error('Error in getAnalytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 