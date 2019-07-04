import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthValidateService } from './auth-validate.service';

@Injectable({
    providedIn: 'root'
})
export class RouteGuard implements CanActivate, CanActivateChild, CanLoad {

    constructor(private authServ: AuthValidateService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.check(route, state);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.check(childRoute, state);
    }

    canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
        return true;
    }


    private check(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let routeConfig = route.routeConfig;
        if (routeConfig.loadChildren) {
            routeConfig = route.firstChild.routeConfig;
        }
        return this.authServ.checkRoute(routeConfig, state.url);
    }


}