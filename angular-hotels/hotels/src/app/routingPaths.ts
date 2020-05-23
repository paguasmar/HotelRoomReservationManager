const ROOT_PATH = "http://appserver.alunos.di.fc.ul.pt:3067/catalog/";
export const HOTEL = ROOT_PATH + 'hotel/';
export const HOTELS = ROOT_PATH;
export const ROOM_TYPE = ROOT_PATH + 'hotel/room_type/'; 
export const USER = ROOT_PATH + "reservation/";

export function getHotelUrl(hotel_id){
    return HOTEL + hotel_id;
}

export function getBookingUrl(room_type_id){
    return ROOM_TYPE + room_type_id + "/reservation/create";
}  

export function getRoomsAtUrl(hotel_id,beginDate, endDate){
    return HOTEL + hotel_id + "/room_type/free?beginDate=" + beginDate + "&endDate=" + endDate;
}

export function getRoomsUrl(hotel_id){
    return HOTEL + hotel_id + "/room_types";
}

export function getUserReservationsUrl(email){
    return USER + email;
}

export function getIsRoomTypeFreeUrl(id,beginDate,endDate){
    return ROOM_TYPE + id + "/free?beginDate=" + beginDate + "&endDate=" + endDate;
}