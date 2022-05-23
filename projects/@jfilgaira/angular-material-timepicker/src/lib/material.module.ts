import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { OverlayModule } from '@angular/cdk/overlay';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatRippleModule,
        OverlayModule
    ],
    exports: [
        MatRippleModule,
        OverlayModule
    ]
})
export class MaterialModule { }
