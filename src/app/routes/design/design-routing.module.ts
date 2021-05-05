import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesignFlowComponent } from './flow/flow.component';

const routes: Routes = [{ path: 'flow', component: DesignFlowComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignRoutingModule {}
