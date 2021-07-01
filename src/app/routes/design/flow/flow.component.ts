import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { initGraph } from './graph/graph';
@Component({
  selector: 'app-design-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss'],
})
export class DesignFlowComponent implements AfterViewInit {
  @ViewChild('graph') private readonly graphElement!: ElementRef<HTMLDivElement>;
  @ViewChild('shape') private readonly shapeElemnet!: ElementRef<HTMLDivElement>;
  constructor(private http: _HttpClient, private modal: ModalHelper) {}
  ngAfterViewInit(): void {
    initGraph(this.graphElement, this.shapeElemnet);
  }
}
