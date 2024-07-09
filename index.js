class Room {
    constructor({ name, bookings, rate, discount }) {
        this.name = name;
        this.bookings = bookings;
        this.rate = rate;
        this.discount = discount;
    }

    isOccupied(date) {
        const checkDate = new Date(date);
        return this.bookings.some(booking => {
            const checkIn = new Date(booking.checkIn);
            const checkOut = new Date(booking.checkOut);
            return checkDate >= checkIn && checkDate < checkOut;
        });
    }

    occupancyPercentage(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        let occupiedDays = 0;
        const totalDays = (end - start) / (1000 * 60 * 60 * 24) + 1;

        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            if (this.isOccupied(date.toISOString().split('T')[0])) {
                occupiedDays++;
            }
        }

        return (occupiedDays / totalDays) * 100;
    }

    static totalOccupancyPercentage(rooms, startDate, endDate) {
        const totalPercentage = rooms.reduce((total, room) => total + room.occupancyPercentage(startDate, endDate), 0);
        return (totalPercentage / rooms.length);
    }

    static availableRooms(rooms, startDate, endDate) {
        return rooms.filter(room => {
            for (let date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
                if (room.isOccupied(date.toISOString().split('T')[0])) {
                    return false;
                }
            }
            return true;
        });
    }
}

class Booking {
    constructor({ name, email, checkIn, checkOut, discount, room }) {
        this.name = name;
        this.email = email;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.discount = discount;
        this.room = room;
    }

    get fee() {
        const nights = (new Date(this.checkOut) - new Date(this.checkIn)) / (1000 * 60 * 60 * 24);
        const roomRate = this.room.rate * ((100 - this.room.discount) / 100);
        const bookingRate = roomRate * ((100 - this.discount) / 100);
        return nights * bookingRate;
    }
}

module.exports = { Room, Booking };
