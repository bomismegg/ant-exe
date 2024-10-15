const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import the models
const Booking = require('./src/models/booking.model');
const Property = require('./src/models/property.model');
const Review = require('./src/models/review.model');
const User = require('./src/models/user.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Seed Data
async function seedData() {
    try {
       
        // Seed properties
        const properties = await Property.insertMany([
            {
                propertyType: 'apartment',
                host: '6701f728d0e4c0222307570c',
                location: {
                    address: '123 Main St',
                    city: 'San Francisco',
                    country: 'USA',
                    latitude: 37.7749,
                    longitude: -122.4194
                },
                pricePerNight: 150,
                amenities: ['WiFi', 'Parking', 'Air Conditioning'],
                bedrooms: 2,
                bathrooms: 1,
                images: ['https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2022/10/condo-vs-apartment.jpeg.jpg', 'https://static.homeguide.com/assets/images/content/homeguide-new-apartment-building.jpg'],
                isAvailable: true,
                maxGuests: 4
            },
            {
                propertyType: 'villa',
                host: '6701f728d0e4c0222307570c',
                location: {
                    address: '456 Ocean Drive',
                    city: 'Miami',
                    country: 'USA',
                    latitude: 25.7617,
                    longitude: -80.1918
                },
                pricePerNight: 300,
                amenities: ['Pool', 'WiFi', 'Parking', 'Kitchen'],
                bedrooms: 5,
                bathrooms: 3,
                images: ['https://res.cloudinary.com/sentral/image/upload/w_1000,h_1000,q_auto:eco,c_fill/f_auto/v1684782440/miro_hero_building_exterior_2000x1125.jpg', 'https://res.cloudinary.com/sentral/image/upload/w_1000,h_1000,q_auto:eco,c_fill/f_auto/v1684782440/miro_hero_building_exterior_2000x1125.jpg'],
                isAvailable: true,
                maxGuests: 10
            },
            {
                propertyType: 'house',
                host: '6701f728d0e4c0222307570d',
                location: {
                    address: '789 Park Ave',
                    city: 'New York',
                    country: 'USA',
                    latitude: 40.7128,
                    longitude: -74.0060
                },
                pricePerNight: 250,
                amenities: ['WiFi', 'Parking', 'Heating', 'Kitchen'],
                bedrooms: 3,
                bathrooms: 2,
                images: ['https://res.cloudinary.com/sentral/image/upload/w_1000,h_1000,q_auto:eco,c_fill/f_auto/v1684782440/miro_hero_building_exterior_2000x1125.jpg', 'https://res.cloudinary.com/sentral/image/upload/w_1000,h_1000,q_auto:eco,c_fill/f_auto/v1684782440/miro_hero_building_exterior_2000x1125.jpg'],
                isAvailable: true,
                maxGuests: 6
            },
            {
                propertyType: 'apartment',
                host: '6701f728d0e4c0222307570d',
                location: {
                    address: '123 Elm St',
                    city: 'Los Angeles',
                    country: 'USA',
                    latitude: 34.0522,
                    longitude: -118.2437
                },
                pricePerNight: 200,
                amenities: ['WiFi', 'Gym', 'Pool'],
                bedrooms: 2,
                bathrooms: 2,
                images: ['https://res.cloudinary.com/sentral/image/upload/w_1000,h_1000,q_auto:eco,c_fill/f_auto/v1684782440/miro_hero_building_exterior_2000x1125.jpg', 'https://res.cloudinary.com/sentral/image/upload/w_1000,h_1000,q_auto:eco,c_fill/f_auto/v1684782440/miro_hero_building_exterior_2000x1125.jpg'],
                isAvailable: true,
                maxGuests: 5
            },
            {
                propertyType: 'villa',
                host: '6701f728d0e4c0222307570d',
                location: {
                    address: '789 Luxury Rd',
                    city: 'Beverly Hills',
                    country: 'USA',
                    latitude: 34.0736,
                    longitude: -118.4004
                },
                pricePerNight: 500,
                amenities: ['Pool', 'Gym', 'WiFi', 'Parking', 'Air Conditioning'],
                bedrooms: 7,
                bathrooms: 4,
                images: ['https://res.cloudinary.com/sentral/image/upload/w_1000,h_1000,q_auto:eco,c_fill/f_auto/v1684782440/miro_hero_building_exterior_2000x1125.jpg', 'https://res.cloudinary.com/sentral/image/upload/w_1000,h_1000,q_auto:eco,c_fill/f_auto/v1684782440/miro_hero_building_exterior_2000x1125.jpg'],
                isAvailable: true,
                maxGuests: 12
            }
        ]);

        console.log('Properties Seeded:', properties);

    
        console.log('Database seeding completed!');
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        mongoose.connection.close();
    }
}

seedData();
