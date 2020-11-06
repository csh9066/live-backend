import express from 'express';

const channelsRouter = express.Router();

channelsRouter.get('/channels');
channelsRouter.post('/channels');

export default channelsRouter;
