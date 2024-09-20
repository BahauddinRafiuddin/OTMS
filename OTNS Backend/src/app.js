import express from 'express';
import cors from 'cors';

const app=express();


// Middlewares
app.use(express.json())
app.use(cors())


// Import Routes.
import landlordRouter from './Routes/landlordRouter.js'
import propertyRouter from './Routes/propertyRouter.js'
import tenantRouter from './Routes/tenantRouter.js'

// Calling Controllers...
app.use('/api/landlord',landlordRouter)
app.use('/api/property',propertyRouter)
app.use('/api/tenant',tenantRouter)
export {app};