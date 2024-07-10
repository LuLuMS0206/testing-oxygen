const { Room, Booking } = require('./index');

describe('Room', () => {
    const roomTemplate = new Room({
        name: 'Suite',
        bookings: [],
        rate: 10000,
        discount: 25
    });

    const booking1 = new Booking({
        name: 'James Hetfield',
        email: 'james@metallica.com',
        checkIn: '2024-01-01',
        checkOut: '2024-01-04',
        discount: 15,
        room: roomTemplate
    });

    const booking2 = new Booking({
        name: 'James Hetfield',
        email: 'james@metallica.com',
        checkIn: '2024-02-01',
        checkOut: '2024-02-04',
        discount: 15,
        room: roomTemplate
    });

    const booking3 = new Booking({
        name: 'James Hetfield',
        email: 'james@metallica.com',
        checkIn: '2024-03-30',
        checkOut: '2024-04-05',
        discount: 15,
        room: roomTemplate
    });

    const bookingsTemplate = [booking1, booking2, booking3];

    describe('isOccupied (verificar si la habitación está ocupada el primer día de la reserva)', () => {
        test('Date is first day of booking', () => {
            const room = new Room({ ...roomTemplate, bookings: bookingsTemplate });
            expect(room.isOccupied('2024-01-01')).toBe(true);
        });

    
        test('Date is in the middle of booking (verificar si la habitación está ocupada en un día intermedio de una reserva)', () => {
            const room = new Room({ ...roomTemplate, bookings: bookingsTemplate });
            expect(room.isOccupied('2024-02-02')).toBe(true);
        });


        test('Date is the day before the last day of booking (verificar si la habitación está ocupada el día antes del último día de una reserva)', () => {
            const room = new Room({ ...roomTemplate, bookings: bookingsTemplate });
            expect(room.isOccupied('2024-02-03')).toBe(true);
        });


        test('Date is before first day of booking (verificar si la habitación está desocupada antes del primer día de una reserva)', () => {
            const room = new Room({ ...roomTemplate, bookings: bookingsTemplate });
            expect(room.isOccupied('2024-03-01')).toBe(false);
        });


        test('Date is after last day of booking (verificar si la habitación está desocupada después del último día de una reserva)', () => {
            const room = new Room({ ...roomTemplate, bookings: bookingsTemplate });
            expect(room.isOccupied('2024-04-10')).toBe(false);
        });


        test('Date is the last day of booking (verificar si la habitación está ocupada el último día de una reserva)', () => {
            const room = new Room({ ...roomTemplate, bookings: bookingsTemplate });
            expect(room.isOccupied('2024-04-05')).toBe(false);
        });


        test('Date is the day after the booking ends (verificar si la habitación está desocupada un día después de que la reserva haya terminado)', () => {
            const room = new Room({ ...roomTemplate, bookings: bookingsTemplate });
            expect(room.isOccupied('2024-04-06')).toBe(false);
        });


        test('Date is the day before the booking starts (verificar si la habitación está ocupada un día antes de que la reserva comience)', () => {
            const room = new Room({ ...roomTemplate, bookings: bookingsTemplate });
            expect(room.isOccupied('2024-03-29')).toBe(false);
        });
    });

    describe('occupancyPercentage (calcular el porcentaje de ocupación de la habitación entre dos fechas específicas)', () => {
        test('Percentage of occupancy between two dates', () => {
            const room = new Room({ ...roomTemplate, bookings: bookingsTemplate });
            expect(room.occupancyPercentage('2024-01-01', '2024-01-31')).toBeCloseTo(9.7, 1); 
        });


        test('Percentage of occupancy with no bookings (calcular el porcentaje de ocupación de la habitación cuando no hay reservas)', () => {
            const room = new Room({ ...roomTemplate, bookings: [] });
            expect(room.occupancyPercentage('2024-01-01', '2024-01-31')).toBe(0);
        });

    });

    describe('totalOccupancyPercentage (calcular el porcentaje total de ocupación para múltiples habitaciones)', () => {

        test('Total occupancy percentage for rooms with no bookings (calcular el porcentaje total de ocupación para habitaciones sin reservas)', () => {
            const room1 = new Room({ ...roomTemplate, bookings: [] });
            const room2 = new Room({ ...roomTemplate, bookings: [] });
            const rooms = [room1, room2];
            expect(Room.totalOccupancyPercentage(rooms, '2024-01-01', '2024-01-31')).toBe(0);
        });


    });

    describe('availableRooms (obtener habitaciones disponibles entre dos fechas específicas)', () => {
        test('Returns available rooms between two dates', () => {
            const room1 = new Room({ ...roomTemplate, bookings: bookingsTemplate });
            const room2 = new Room({ ...roomTemplate, bookings: [] });
            const rooms = [room1, room2];
            expect(Room.availableRooms(rooms, '2024-01-01', '2024-01-31')).toEqual([room2]);
        });


        test('Returns no available rooms when all are booked (obtener habitaciones disponibles cuando todas están reservadas)', () => {
            const fullBooking1 = new Booking({
                name: 'Full Booked 1',
                email: 'full1@booked.com',
                checkIn: '2024-01-01',
                checkOut: '2024-01-31',
                discount: 0,
                room: roomTemplate
            });
            const fullBooking2 = new Booking({
                name: 'Full Booked 2',
                email: 'full2@booked.com',
                checkIn: '2024-01-01',
                checkOut: '2024-01-31',
                discount: 0,
                room: roomTemplate
            });
            const room1 = new Room({ ...roomTemplate, bookings: [fullBooking1] });
            const room2 = new Room({ ...roomTemplate, bookings: [fullBooking2] });
            const rooms = [room1, room2];
            expect(Room.availableRooms(rooms, '2024-01-01', '2024-01-31')).toEqual([]);
        });

    
        test('Returns all rooms when there are no bookings (obtener habitaciones disponibles cuando no hay reservas)', () => {
            const room1 = new Room({ ...roomTemplate, bookings: [] });
            const room2 = new Room({ ...roomTemplate, bookings: [] });
            const rooms = [room1, room2];
            expect(Room.availableRooms(rooms, '2024-01-01', '2024-01-31')).toEqual([room1, room2]);
        });
    });
});

describe('Booking', () => {
    const roomTemplate = new Room({
        name: 'Suite',
        bookings: [],
        rate: 10000,
        discount: 25
    });


    test('Booking fee calculation with room and booking discount (calcular la tarifa de una reserva con descuento en la habitación y la reserva)', () => {
        const booking = new Booking({
            name: 'Bruce Banner',
            email: 'brucebanner1@mail.com',
            checkIn: '2024-01-01',
            checkOut: '2024-01-05',
            discount: 20,
            room: roomTemplate
        });
        const expectedFee = 4 * (10000 * 0.75) * 0.8; 
        expect(booking.fee).toBe(expectedFee);
    });


    test('Booking fee calculation with booking discount only (calcular la tarifa de una reserva sin descuento en la habitación y con descuento en la reserva)', () => {
        const room = new Room({ ...roomTemplate, discount: 0 });
        const booking = new Booking({
            name: 'Bruce Banner',
            email: 'brucebanner1@mail.com',
            checkIn: '2024-01-01',
            checkOut: '2024-01-05',
            discount: 20,
            room: room
        });
        const expectedFee = 4 * 10000 * 0.8; 
        expect(booking.fee).toBe(expectedFee);
    });


    test('Booking fee calculation with no discounts (calcular la tarifa de una reserva sin descuento en la habitación ni en la reserva)', () => {
        const room = new Room({ ...roomTemplate, discount: 0 });
        const booking = new Booking({
            name: 'Bruce Banner',
            email: 'brucebanner1@mail.com',
            checkIn: '2024-01-01',
            checkOut: '2024-01-05',
            discount: 0,
            room: room
        });
        const expectedFee = 4 * 10000; 
        expect(booking.fee).toBe(expectedFee);
    });


    test('Booking fee calculation with room discount only (calcular la tarifa de una reserva con descuento en la habitación y sin descuento en la reserva)', () => {
        const booking = new Booking({
            name: 'Bruce Banner',
            email: 'brucebanner1@mail.com',
            checkIn: '2024-01-01',
            checkOut: '2024-01-05',
            discount: 0,
            room: roomTemplate
        });
        const expectedFee = 4 * (10000 * 0.75); 
        expect(booking.fee).toBe(expectedFee);
    });


    test('Single night booking fee calculation with all discounts (calcular la tarifa de una reserva de una sola noche con todos los descuentos aplicados)', () => {
        const booking = new Booking({
            name: 'Bruce Banner',
            email: 'brucebanner1@mail.com',
            checkIn: '2024-01-01',
            checkOut: '2024-01-02',
            discount: 20,
            room: roomTemplate
        });
        const expectedFee = (10000 * 0.75) * 0.8; 
        expect(booking.fee).toBe(expectedFee);
    });

    test('Single night booking fee calculation with no discounts (calcular la tarifa de una reserva de una sola noche sin descuento)', () => {
        const room = new Room({ ...roomTemplate, discount: 0 });
        const booking = new Booking({
            name: 'Bruce Banner',
            email: 'brucebanner1@mail.com',
            checkIn: '2024-01-01',
            checkOut: '2024-01-02',
            discount: 0,
            room: room
        });
        const expectedFee = 10000; 
        expect(booking.fee).toBe(expectedFee);
    });
});
