import { AuthValidateService } from './auth-validate.service';
import { RouteGuard } from './route-guard';


export const AUTH_PROVIDERS = [
    AuthValidateService,
    RouteGuard
];