import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, EmbeddedViewRef } from '@angular/core';
import { AuthValidateService } from 'app/auth/auth-validate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ALL_RIGHTS_MENU_ACTION } from 'app/models/DCMenu';


@Directive({
// tslint:disable-next-line: directive-selector
    selector: '[authValidate]'
})
export class AuthValidateDirective {

    private permit: string;
    private elseTemplateRef: TemplateRef<void> | null = null;
    private thenViewRef: EmbeddedViewRef<void> | null = null;
    private elseViewRef: EmbeddedViewRef<void> | null = null;

    constructor(private templateRef: TemplateRef<void>,
                private viewContainer: ViewContainerRef,
                private authServ: AuthValidateService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    @Input()
    set authValidate(permit: string) {
        this.permit = permit || ALL_RIGHTS_MENU_ACTION;
        this.updateView();
    }

    @Input()
    set authValidateElse(elseTemplateRef: TemplateRef<void>) {
        this.elseTemplateRef = elseTemplateRef;
        this.elseViewRef = null;
        this.updateView();
    }

    private updateView() {
        const valid = this.authServ.checkPermit(this.route.routeConfig, this.router.url, this.permit);
        if (valid) {
            if (!this.thenViewRef) {
              this.viewContainer.clear();
              this.elseViewRef = null;
              if (this.templateRef) {
                this.thenViewRef = this.viewContainer.createEmbeddedView(this.templateRef);
              }
            }
          } else {
            if (!this.elseViewRef) {
              this.viewContainer.clear();
              this.thenViewRef = null;
              if (this.elseTemplateRef) {
                this.elseViewRef = this.viewContainer.createEmbeddedView(this.elseTemplateRef);
              }
            }
          }
    }
}
