[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)

# ShareWise

[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)
[![GitHub release](https://img.shields.io/github/release/Naereen/StrapDown.js.svg)](https://GitHub.com/Naereen/StrapDown.js/releases/)
[![Github all releases](https://img.shields.io/github/downloads/Naereen/StrapDown.js/total.svg)](https://GitHub.com/Naereen/StrapDown.js/releases/)
[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)


ShareWise is a  a web-based platform that connects schools with organisations willing to donate surplus tech supplies that would otherwise be destroyed/end up in landfills. 

## Getting started

### Prerequisites

- NPM
- Parcel bundler

### Installation (Client)

1. Clone the repository

   ```bash
   git clone [repo]
   ```

2. Navigate to the project directory

   ```bash
   cd client
   ```

3. Install dependencies

   ```bash
   npm install
   ```

4. Run the application

   ```bash
   npm start
   ```

5. Build the application

   ```bash
   npm run build
   ```

### Prerequisites

- Node.js
- NPM
- A cloud-based database hosting platform such as [Supabase](https://supabase.com) or [Neon](https://console.neon.tech).

### Installation (Server)

1. Clone the repository.

   - Run `git clone [repo]`.

2. Navigate to the project directory.

   - Navigate to the project with `cd server`.

3. Install dependencies.

   - Run `npm install` to install all dependencies for the project.

4. Setup database.

   - Create a database instance on [Supabase](https://supabase.com) (or other cloud-based database hosting platform such as [Neon](https://console.neon.tech))

   - Retrieve the database URL connection string & copy it.

   - Create a `.env` file in the root directory with the following:

   ```
   DB_URL=<YOUR_DB_URL>
   ```

   - Replace `<YOUR_DB_URL>` with the database URL you copied.

   - Run `npm run setup-db` to setup the database.

5. Setup your port.

   - Add a `PORT` key assigned to port 3000 `.env` file.

   ```
   PORT=3000
   ```

6. Run the server.

   - Run `npm run dev` to run the server in development mode.

   - Run `npm start` to run the server in production mode.

### Database Schema

Please check `server/src/db/setup.sql` file.

## Running the app using Docker

### Provide the environment variables

In order to run the app using Docker, provide the ENV variable ENV DB_URL by setting <YOUR_DB_URL> (ENV PORT is already set to 3000) in the existing Dockerfile so they are accessible inside the application.

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
ENV PORT=3000
ENV DB_URL=<YOUR_DB_URL>
EXPOSE 3000
RUN npm run setup-db
CMD ["node", "src/index.js"]
```

### Build Docker Image and run the Container

1. Navigate to project directory `cd api`

2. Build the Image off of the Snacks API: `docker build -t <YOUR_DOCKER_USERNAME>/athena:0.0.1.RELEASE .`

3. Run a container: `docker run -d -p <HOST_PORT>:<CONTAINER_PORT> --name snacks-api <YOUR_DOCKER_USERNAME>/athena:0.0.1.RELEASE`

   - Choose your <HOST_PORT> value of your choice in order to access the container using the browser.
   - The <CONTAINER_PORT> value must match the `ENV PORT=3000` defined in the Dockerfile.

## API Endpoints

### BASE URL

`http://localhost:<PORT>/snacks`

### API Endpoints

| Route        | Response                                                           |
| ------------ | ------------------------------------------------------------------ |
| `/`          | Returns a JSON object describing the API.                          |
| `/users`     | User authentication route.                                         |
| `/dashboard` | Accepts a JSON object and uses it to create and store a new snack. |
| `/topics`    | Returns a JSON object representing the game topics.                |
| `/scores`    | Returns a JSON object representing user scores.                    |
| `/questions` | Returns a JSON object representing user game topics questions.     |

### Example Request

Use the following GET request to get api info - `GET /`

`curl -X GET http://localhost:<port>/`

A successful response will return a JSON response as follows:

```json
{
  "name": "Athena - Educational App",
  "description": "Educational application for Non-STEM subjects."
}
```
## Technologies

| Frontend (Client) | Backend (Server) | Deployment | Analysis/Design |
| ----------- | ----------- | ----------- | ----------- |
| HTML | NodeJs | Docker | Figma |
|Bootstrap | Express | AWS | Lucid Chart |
| JavaScript | PostgresSQL | Ansible | Trello |
| Jest | JWT/BCrypt | Jenkins | Miro |  |
|   | Nodemon | Terraform |  |
|   | Cors |   |  |
|   | Jest |   |  |

## Process
<details>
<summary> Analysis and visualisation  </summary>
    <br> - Brainstormed ideas for the application
    <br> - Created our problem statement and solution

</details>
<p>
</p>
<details>
<summary> Designing </summary>
    <br> - Began analysis work: Stakeholder analysis, user stories/research, risk matrix, high level solution diagram and devops architecture diagram
    <br> - Created low-fi wireframes using Figma
    <br> - Mapped out and agreed on the ERD
    <br> - Designed high-fi wireframes using Figma
    <br> - Agreed on the project work methodology and ways of working
    <br> - Began building the Trello board
</details>
<p>
</p>
<details>
<summary> Building frontend, backend and deloyment </summary>
    <br> - After confirming our assigned tasks, the building of backend began (API and databases)
    <br> - Finalised high-fi wireframes
    <br> - Development team was split into frontend and backend to allow both to be built simultaniously
    <br> - Early deployment of the application to mitigate risks and bugs
    <br> - Building of pipelines using Jenkins
    <br> - Created the assets needed for the application for webpage styling after the base frontend and page connections were in a strong position
    <br> - Testing on frontend and backend
</details>
<p>
</p>

## Wins & Challenges

### Wins
- 
- 
-

### Challenges & Solutions
- Difficulties with Cloud/DevOps, specifically getting the Jenkins pipeline to work (took longer than expected) ​

       Worked as a team while on call to debug​

- Connections between pages deemed tricker than expected and sometimes broke the system. ​

        Standdown sessions were scheduled at 3pm to account for extended runtime for debugging (as the whole team was available for support). In addition to that, it allowed the debugged to be less stressful. ​

- Merge conflicts which sometimes broke the application ​

        Worked as a team while the 'master' of the repo lead the changes​

- Unexpected events during the project meant that there were some occasions where the full team was not available​

        Sharing responsibilities amongst the team, reprioritising tasks and pushing certain tasks forward to avoid it becoming a blocker later down the road.


### Bugs
- Application would sometimes break after a merge which was resolved with team effort

## Future Features

### Functionalities
- Database for donations​
- Profile introduction pages​
- High level data reporting​
    - Higher level breakdown of impact made through recycling​
    - Ability to load down the reports into CSV or PDFs​

- Higher level of visibility for:​
    - Delivery tracking​
    - Location comparison​
    - Page design selections to cater to visual impairments​
    - Ability to choose different themes to fit user’s needs​
    - Ability to adjust font size, etc 

### Expanding our reach​

- Expand links with organisations + overseas​
    - Overseas companies​
    - Food/Retail organisations​
- Include other services/sectors to receive supplies:​
    - Hospitals​
    - Care homes​
    - Shelters​

- Donation Events​
    - Organisations to go the schools to donate and talk to schools​
    - View how their items are being used​
    - Fundraising Events​
    - Connects the organisations/schools​
    - Updates on the application/provides reporting and transparency​
- Leadership boards​
    - Badges on LinkedIn​
    - Advertisements for their website

