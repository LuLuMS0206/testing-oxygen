class Room {
    name: string;
    bookings: Booking[];
    rate: number;
    discount: number;

    constructor({ name, bookings, rate, discount }: { name: string, bookings: Booking[], rate: number, discount: number }) {
        this.name = name;
        this.bookings = bookings;
        this.rate = rate;
        this.discount = discount;
    }

    isOccupied(date: string): boolean {
        const checkDate = new Date(date);
        return this.bookings.some(booking => {
            const checkIn = new Date(booking.checkIn);
            const checkOut = new Date(booking.checkOut);
            return checkDate >= checkIn && checkDate < checkOut;
        });
    }

    occupancyPercentage(startDate: string, endDate: string): number {
        const start = new Date(startDate);
        const end = new Date(endDate);
        let occupiedDays = 0;
        const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1;

        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            if (this.isOccupied(date.toISOString().split('T')[0])) {
                occupiedDays++;
            }
        }

        return (occupiedDays / totalDays) * 100;
    }

    static totalOccupancyPercentage(rooms: Room[], startDate: string, endDate: string): number {
        const totalPercentage = rooms.reduce((total, room) => total + room.occupancyPercentage(startDate, endDate), 0);
        return totalPercentage / rooms.length;
    }

    static availableRooms(rooms: Room[], startDate: string, endDate: string): Room[] {
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
    name: string;
    email: string;
    checkIn: string;
    checkOut: string;
    discount: number;
    room: Room;

    constructor({ name, email, checkIn, checkOut, discount, room }: { name: string, email: string, checkIn: string, checkOut: string, discount: number, room: Room }) {
        this.name = name;
        this.email = email;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.discount = discount;
        this.room = room;
    }

    get fee(): number {
        const nights = (new Date(this.checkOut).getTime() - new Date(this.checkIn).getTime()) / (1000 * 60 * 60 * 24);
        const roomRate = this.room.rate * ((100 - this.room.discount) / 100);
        const bookingRate = roomRate * ((100 - this.discount) / 100);
        return nights * bookingRate;
    }
}

export { Room, Booking };
