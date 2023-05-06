# PrioriQ
> Final Project for CS-546

PrioriQ is a web-based task management application designed to assist users in organizing their tasks efficiently. The platform features a task scheduling algorithm that employs a priority-based preemptive approach to alleviate the burden of prioritizing tasks and managing deadlines. This application is ideal for teams working in a collaborative environment or individuals who struggle with effective task management. With PrioriQ, users can streamline their workflow and increase productivity while reducing the likelihood of missed deadlines. Overall, PrioriQ is a task management application designed to help users and teams stay organized and on top of their tasks and improve their productivity by reduce the stress of task management.

## Authors:
- Nouman Syed
- Michael Bearint
- Athena Kiriakoulis
- Mark Falletta

## Setup
1. Clone the repository using the following command.
    ```
    git clone https://github.com/noumxn/Task-Management-Application.git
    ```
2. Before using our web application, please ensure that you have the following runtime dependencies installed on your system: `node.js`, `npm`, and `MongoDB`. If you do not have these dependencies installed, please follow the instructions below to install and set them up locally:

   - To install node.js and npm, please check out the node.js website (https://nodejs.org/en/) and download the appropriate installer for your OS. Follow the installation instructions provided by the installer.

   - To install MongoDB, please visit the MongoDB website (https://www.mongodb.com/docs/manual/installation/) and download the appropriate installer for your operating system. Follow the installation instructions provided by the installer.

3. Once you have successfully installed these, you can run the following commands to install the development dependencies.
    ```
    npm i
    ```
    OR
    ```
    yarn
    ```
4. You will need to create a `.env` file using the template `.env.example`
   ```
   SALT_ROUNDS= // Number of rounds for password encryption.
   MONGO_SERVER_URL= // URL for the MongoDB server.
   MONGO_DATABASE_NAME= // Name of the MongoDB database that your application will use.
   PORT= // Port number that your web application will listen to for incoming requests.
   ```

5. Run the following command to populate your database:
    ```
    npm run seed
    ```
    OR
    ```
    yarn seed
    ```
6. Start the application using the following command:
    ```
    npm start
    ```
    OR 
    ```
    yarn start
    ```

