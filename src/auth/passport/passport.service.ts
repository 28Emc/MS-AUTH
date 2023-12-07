import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PassportService {
    passportGoogleCallback(req: any) {
        if (!req) {
            throw new NotFoundException("User info from Google not found");
        }
        return {
            message: 'User info from Google.',
            data: req.user
        };
    }
}
