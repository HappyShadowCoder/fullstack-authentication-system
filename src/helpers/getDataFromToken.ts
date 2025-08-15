import {NextRequest} from 'next/server';
import jwt from 'jsonwebtoken'
import toast from "react-hot-toast";

export const getDataFromToken = async (request : NextRequest) => {
    try {
        const token = request.cookies.get('token')?.value || '';

        if (!token) {
            throw new Error('No token found');
        }
        
        const decodedToken:any = jwt.verify(token , process.env.TOKEN_SECRET!);
        return decodedToken.id; 
    } catch (error : any) {
        throw new Error(error.message || 'Token verification failed');
    }
}