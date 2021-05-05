import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { initGraph } from './graph/graph';

@Component({
  selector: 'app-design-flow',
  templateUrl: './flow.component.html',
})
export class DesignFlowComponent implements AfterViewInit {
  @ViewChild('container') container: ElementRef;
  constructor(private http: _HttpClient, private modal: ModalHelper) {}

  ngAfterViewInit(): void {
    initGraph(this.container);
  }

  add(): void {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
  }
}
