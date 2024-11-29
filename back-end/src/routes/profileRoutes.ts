import express from 'express';
import { ProfileController } from '../controllers/profileController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * @swagger
 * /profiles:
 *   post:
 *     tags:
 *       - Profile
 *     summary: Create a new profile
 *     description: Creates a new profile for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       201:
 *         description: Profile successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.route('/')
  .post(ProfileController.createProfile);

/**
 * @swagger
 * /profiles/current:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Get current user's profile
 *     description: Retrieves the current user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 *   put:
 *     tags:
 *       - Profile
 *     summary: Update current user's profile
 *     description: Updates the current user's profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 *   delete:
 *     tags:
 *       - Profile
 *     summary: Delete current user's profile
 *     description: Deletes the current user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Profile deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.route('/current')
  .get(ProfileController.getCurrentProfile)
  .put(ProfileController.updateCurrentProfile)
  .delete(ProfileController.deleteCurrentProfile);

/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Get a profile
 *     description: Retrieves a profile by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *     responses:
 *       200:
 *         description: Profile found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 *   put:
 *     tags:
 *       - Profile
 *     summary: Update a profile
 *     description: Updates an existing profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Profile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 *   delete:
 *     tags:
 *       - Profile
 *     summary: Delete a profile
 *     description: Deletes an existing profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *     responses:
 *       204:
 *         description: Profile deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.route('/:id')
  .get(ProfileController.getProfile)
  .put(ProfileController.updateProfile)
  .delete(ProfileController.deleteProfile);

export default router;
