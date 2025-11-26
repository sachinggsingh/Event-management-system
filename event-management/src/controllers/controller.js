import { Event } from "../models/models.js";
import { validateEvent } from "../helpers/helpers.js";

export const CreateEvent = async (req, res) => {
  try {
    //Validate request data
    const { error } = validateEvent(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

    //Check if event already exists (by time + venue)
    const existingEvent = await Event.findOne({
      time: req.body.time,
      venue: req.body.venue,
    });
    if (existingEvent) {
      return res.status(400).json({
        success: false,
        message: "Event already exists at this time and venue",
      });
    }

    // Create new event
    const event = await Event.create(req.body);

    // Success response
    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const GetAllTheEvent = async (req,res)=>{
    try{
      const event = await Event.find()
      return res.status(200).json({
        success: true,
        data: event
      })
    }catch(error){
        console.error(error)
        console.log("Error in Getting the Event")
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const GetEventById = async (req,res)=>{
    try{
      const event = await Event.findById(req.params.id)
      return res.status(200).json({
        success: true,
        data: event
      })
    }catch(error){
        console.error(error)
        console.log("Error in Getting the Event")
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
} 

export const DeleteEventById = async (req,res)=>{
    try{
      const event = await Event.findByIdAndDelete(req.params.id)
      return res.status(200).json({
        success: true,
        data: event
      })
    }catch(error){
        console.error(error)
        console.log("Error in Getting the Event")
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const UpdateEventById = async (req,res)=>{
    try{
      const event = await Event.findByIdAndUpdate(req.params.id,req.body,{new:true})
      return res.status(200).json({
        success: true,
        data: event
      })
    }catch(error){
        console.error(error)
        console.log("Error in Getting the Event")
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}