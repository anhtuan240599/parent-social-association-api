/**
 * @swagger
 * /api/auth/user:
 *  get:
 *      description: get user login information
 *      responses:
 *          '200':
 *            description: success
 *
 *
 */

/**
 * @swagger
 * /decks:
 *  get:
 *      description: get all post 
 *      responses:
 *          '200':
 *            description: success
 *
 *
 */

/**
 * @swagger
 * /api/auth/user:
 *  put:
 *      summary: change user information
 *      description: change user login information
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                fullName:
 *                  type: string
 *                  description: full name of user
 *                email:
 *                  type: string
 *                  description: email of user
 * 
 *      responses:
 *        '200':
 *          description: change success
 */

/**
 * @swagger
 * /message/`${userID}`:
 *  post:
 *      summary: user register
 *      description: user register
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                name:
 *                  type: string
 *                  description: name of user
 *                email:
 *                  type: string
 *                  description: email of user
 *                password:
 *                  type: string
 *                  description: password of user
 *      responses:
 *          '200':
 *              description: register success
 *          '403':
 *              description: user already have been register
 */

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *      summary: user register
 *      description: user register
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                name:
 *                  type: string
 *                  description: name of user
 *                email:
 *                  type: string
 *                  description: email of user
 *                password:
 *                  type: string
 *                  description: password of user
 *      responses:
 *          '200':
 *              description: register success
 *          '403':
 *              description: user already have been register
 */

 /**
 * @swagger
 * /decks:
 *  post:
 *      summary: new post
 *      description: new post
 *      requestBody:
 *        content:
 *           application/json:
 *            schema:
 *              properties:
 *                title:
 *                  type: string
 *                  description: title of post
 *           multipart/form-data:
 *             schema:
 *                type: object
 *                properties:
 *                  image:
 *                      type: object
 *                      description: image of post
 *      responses:
 *          '200':
 *              description: register success
 *          '403':
 *              description: user already have been register
 */