import { ElementRef } from '@angular/core';
import { mxgraph } from 'mxgraph';
declare var require: any;
const mx: typeof mxgraph = require('mxgraph')({
  mxBasePath: 'assets/mxgraph',
});

export function initGraph(container: ElementRef): void {
  const graph = new mx.mxGraph(container.nativeElement);
  const parent = graph.getDefaultParent();
  graph.getModel().beginUpdate();
  try {
    const v1: any = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30);
    const v2: any = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
    graph.insertEdge(parent, null, '', v1, v2);
  } finally {
    // Updates the display
    graph.getModel().endUpdate();
  }
}
