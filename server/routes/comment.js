import express from 'express';
import { addReply, createComment, getComments, deleteReply } from '../controllers/comment.js';


const router = express.Router();

router.post('/:postId/create', createComment);

router.get('/:postId', getComments);

router.put('/:commentId/reply/:replyId?', addReply);

// Route to delete a specific reply from a comment or reply
router.delete('/:commentId/reply/:replyId', deleteReply);


export default router;