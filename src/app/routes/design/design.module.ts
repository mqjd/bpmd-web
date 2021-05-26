import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { DesignRoutingModule } from './design-routing.module';
import { DesignFlowComponent } from './flow/flow.component';

const COMPONENTS: Type<void>[] = [DesignFlowComponent];

@NgModule({
  imports: [SharedModule, DesignRoutingModule],
  declarations: COMPONENTS,
})
export class DesignModule {}
