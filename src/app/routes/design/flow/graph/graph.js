const mx = require('mxgraph')({
  mxImageBasePath: 'assets/mxgraph/images',
  mxBasePath: 'assets/mxgraph',
});
const {
  mxGraph,
  mxImage,
  mxVertexHandler,
  mxGraphHandler,
  mxCell,
  mxTriangle,
  mxConnectionConstraint,
  mxPoint,
  mxGeometry,
  mxDragSource,
  mxShape,
  mxRectangleShape,
  mxPopupMenu,
  mxPopupMenuHandler,
  mxRectangle,
  mxClient,
  mxConstraintHandler,
  mxGraphView,
  mxUtils,
  mxConnectionHandler,
  mxCellHighlight,
  mxOutline,
  mxEdgeHandler,
  mxRubberband,
  mxConstants,
  mxEvent,
} = mx;
const HoverIcons = {
  arrowFill: '#29b6f2',
};

function createSvgImage(w, h, data, coordWidth, coordHeight) {
  var tmp = unescape(
    encodeURIComponent(
      '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' +
        w +
        'px" height="' +
        h +
        'px" ' +
        (coordWidth != null && coordHeight != null ? 'viewBox="0 0 ' + coordWidth + ' ' + coordHeight + '" ' : '') +
        'version="1.1">' +
        data +
        '</svg>',
    ),
  );
  const image = new mxImage('data:image/svg+xml;base64,' + btoa(tmp), w, h);
  new Image().src = image.src;
  return image;
}

function initHandleImage() {
  mxVertexHandler.TABLE_HANDLE_COLOR = '#fca000';
  const mainHandle = createSvgImage(
    18,
    18,
    '<circle cx="9" cy="9" r="5" stroke="#fff" fill="' + HoverIcons.arrowFill + '" stroke-width="1"/>',
  );
  mxVertexHandler.prototype.handleImage = mainHandle;
  mxEdgeHandler.prototype.handleImage = mainHandle;
  mxOutline.prototype.sizerImage = mainHandle;

  const secondaryHandle = createSvgImage(16, 16, '<path d="m 8 3 L 13 8 L 8 13 L 3 8 z" stroke="#fff" fill="#fca000"/>');
  mxVertexHandler.prototype.secondaryHandleImage = secondaryHandle;

  const terminalHandle = createSvgImage(
    18,
    18,
    '<circle cx="9" cy="9" r="5" stroke="#fff" fill="' +
      HoverIcons.arrowFill +
      '" stroke-width="1"/><circle cx="9" cy="9" r="2" stroke="#fff" fill="transparent"/>',
  );
  mxEdgeHandler.prototype.terminalHandleImage = terminalHandle;

  const fixedHandle = createSvgImage(
    18,
    18,
    '<circle cx="9" cy="9" r="5" stroke="#fff" fill="' +
      HoverIcons.arrowFill +
      '" stroke-width="1"/><path d="m 7 7 L 11 11 M 7 11 L 11 7" stroke="#fff"/>',
  );
  mxEdgeHandler.prototype.fixedHandleImage = fixedHandle;
  mxEdgeHandler.prototype.labelHandleImage = secondaryHandle;
}

function initRotate() {
  // Adds rotation handle and live preview
  mxVertexHandler.prototype.rotationEnabled = true;
  // rotate image
  const rotationHandle = createSvgImage(
    16,
    16,
    '<path stroke="' +
      HoverIcons.arrowFill +
      '" fill="' +
      HoverIcons.arrowFill +
      '" d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"/>',
    24,
    24,
  );
  const vertexHandlerCreateSizerShape = mxVertexHandler.prototype.createSizerShape;
  mxVertexHandler.prototype.createSizerShape = function (bounds, index, fillColor) {
    this.handleImage =
      index == mxEvent.ROTATION_HANDLE ? rotationHandle : index == mxEvent.LABEL_HANDLE ? this.secondaryHandleImage : this.handleImage;
    return vertexHandlerCreateSizerShape.apply(this, arguments);
  };

  // Invokes turn on single click on rotation handle
  mxVertexHandler.prototype.rotateClick = function () {
    var stroke = mxUtils.getValue(this.state.style, mxConstants.STYLE_STROKECOLOR, mxConstants.NONE);
    var fill = mxUtils.getValue(this.state.style, mxConstants.STYLE_FILLCOLOR, mxConstants.NONE);

    if (this.state.view.graph.model.isVertex(this.state.cell) && stroke == mxConstants.NONE && fill == mxConstants.NONE) {
      var angle = mxUtils.mod(mxUtils.getValue(this.state.style, mxConstants.STYLE_ROTATION, 0) + 90, 360);
      this.state.view.graph.setCellStyles(mxConstants.STYLE_ROTATION, angle, [this.state.cell]);
    } else {
      this.state.view.graph.turnShapes([this.state.cell]);
    }
  };
}

function initMxConstants() {
  // Changes default colors
  /**
   * Measurements Units
   */
  mxConstants.POINTS = 1;
  mxConstants.MILLIMETERS = 2;
  mxConstants.INCHES = 3;
  /**
   * This ratio is with page scale 1
   */
  mxConstants.PIXELS_PER_MM = 3.937;
  mxConstants.PIXELS_PER_INCH = 100;

  mxConstants.SHADOW_OPACITY = 0.25;
  mxConstants.SHADOWCOLOR = '#000000';
  mxConstants.VML_SHADOWCOLOR = '#d0d0d0';
  mxGraph.prototype.pageBreakColor = '#c0c0c0';
  mxGraph.prototype.pageScale = 1;
  // Sets colors for handles
  mxConstants.HANDLE_FILLCOLOR = '#29b6f2';
  mxConstants.HANDLE_STROKECOLOR = '#0088cf';
  mxConstants.VERTEX_SELECTION_COLOR = '#00a8ff';
  mxConstants.OUTLINE_COLOR = '#00a8ff';
  mxConstants.OUTLINE_HANDLE_FILLCOLOR = '#99ccff';
  mxConstants.OUTLINE_HANDLE_STROKECOLOR = '#00a8ff';
  mxConstants.CONNECT_HANDLE_FILLCOLOR = '#cee7ff';
  mxConstants.EDGE_SELECTION_COLOR = '#00a8ff';
  mxConstants.DEFAULT_VALID_COLOR = '#00a8ff';
  mxConstants.LABEL_HANDLE_FILLCOLOR = '#cee7ff';
  mxConstants.GUIDE_COLOR = '#0088cf';
  mxConstants.HIGHLIGHT_OPACITY = 30;
  mxConstants.HIGHLIGHT_SIZE = 5;
  // mxVertexHandler.prototype.manageSizers = true;
  mxVertexHandler.prototype.livePreview = true;
  mxGraphHandler.prototype.maxLivePreview = 16;

  // Increases default rubberband opacity (default is 20)
  mxRubberband.prototype.defaultOpacity = 30;

  // Enables connections along the outline, virtual waypoints, parent highlight etc
  mxConnectionHandler.prototype.outlineConnect = true;
  mxCellHighlight.prototype.keepOnTop = true;
  mxVertexHandler.prototype.parentHighlightEnabled = true;

  mxEdgeHandler.prototype.parentHighlightEnabled = true;
  mxEdgeHandler.prototype.dblClickRemoveEnabled = true;
  mxEdgeHandler.prototype.straightRemoveEnabled = true;
  mxEdgeHandler.prototype.virtualBendsEnabled = true;
  mxEdgeHandler.prototype.mergeRemoveEnabled = true;
  mxEdgeHandler.prototype.manageLabelHandle = true;
  mxEdgeHandler.prototype.outlineConnect = true;
}

let Graph = function (container, model, renderHint, stylesheet, themes, standalone) {
  mxGraph.call(this, container, model, renderHint, stylesheet);
};
mxUtils.extend(Graph, mxGraph);
/**
 * Returns true if the given cell is a table cell.
 */
Graph.prototype.isTableCell = function (cell) {
  return this.model.isVertex(cell) && this.isTableRow(this.model.getParent(cell));
};

/**
 * Returns true if the given cell is a table row.
 */
Graph.prototype.isTableRow = function (cell) {
  return this.model.isVertex(cell) && this.isTable(this.model.getParent(cell));
};

/**
 * Returns true if the given cell is a table.
 */
Graph.prototype.isTable = function (cell) {
  var style = this.getCellStyle(cell);

  return style != null && style['childLayout'] == 'tableLayout';
};
Graph.prototype.turnShapes = function (cells, backwards) {
  var model = this.getModel();
  var select = [];

  model.beginUpdate();
  try {
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];

      if (model.isEdge(cell)) {
        var src = model.getTerminal(cell, true);
        var trg = model.getTerminal(cell, false);

        model.setTerminal(cell, trg, true);
        model.setTerminal(cell, src, false);

        var geo = model.getGeometry(cell);

        if (geo != null) {
          geo = geo.clone();

          if (geo.points != null) {
            geo.points.reverse();
          }

          var sp = geo.getTerminalPoint(true);
          var tp = geo.getTerminalPoint(false);

          geo.setTerminalPoint(sp, false);
          geo.setTerminalPoint(tp, true);
          model.setGeometry(cell, geo);

          // Inverts constraints
          var edgeState = this.view.getState(cell);
          var sourceState = this.view.getState(src);
          var targetState = this.view.getState(trg);

          if (edgeState != null) {
            var sc = sourceState != null ? this.getConnectionConstraint(edgeState, sourceState, true) : null;
            var tc = targetState != null ? this.getConnectionConstraint(edgeState, targetState, false) : null;

            this.setConnectionConstraint(cell, src, true, tc);
            this.setConnectionConstraint(cell, trg, false, sc);
          }

          select.push(cell);
        }
      } else if (model.isVertex(cell)) {
        var geo = this.getCellGeometry(cell);

        if (geo != null) {
          // Rotates the size and position in the geometry
          if (!this.isTable(cell) && !this.isTableRow(cell) && !this.isTableCell(cell) && !this.isSwimlane(cell)) {
            geo = geo.clone();
            geo.x += geo.width / 2 - geo.height / 2;
            geo.y += geo.height / 2 - geo.width / 2;
            var tmp = geo.width;
            geo.width = geo.height;
            geo.height = tmp;
            model.setGeometry(cell, geo);
          }

          // Reads the current direction and advances by 90 degrees
          var state = this.view.getState(cell);

          if (state != null) {
            var dirs = [mxConstants.DIRECTION_EAST, mxConstants.DIRECTION_SOUTH, mxConstants.DIRECTION_WEST, mxConstants.DIRECTION_NORTH];
            var dir = mxUtils.getValue(state.style, mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_EAST);
            this.setCellStyles(
              mxConstants.STYLE_DIRECTION,
              dirs[mxUtils.mod(mxUtils.indexOf(dirs, dir) + (backwards ? -1 : 1), dirs.length)],
              [cell],
            );
          }

          select.push(cell);
        }
      }
    }
  } finally {
    model.endUpdate();
  }
  return select;
};
Graph.prototype.pageVisible = true;
Graph.prototype.defaultPageBackgroundColor = '#ffffff';
Graph.prototype.defaultPageBorderColor = '#ffffff';
mxGraphView.prototype.gridColor = '#d0d0d0';
function initBackGround() {
  mxGraphView.prototype.validateBackgroundPage = function () {
    this.validateBackgroundStyles();
  };
  mxGraphView.prototype.validateBackgroundStyles = function () {
    let graph = this.graph;
    let canvas = graph.view.canvas;
    if (canvas.ownerSVGElement != null) {
      canvas = canvas.ownerSVGElement;
    }
    let color = graph.defaultPageBackgroundColor;
    if (canvas.style.backgroundColor != color) {
      let image = 'url(' + 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(this.createSvgGrid(this.gridColor)))) + ')';
      canvas.style.backgroundColor = color;
      canvas.style.backgroundImage = image;
    }
  };
  // Returns the SVG required for painting the background grid.
  mxGraphView.prototype.createSvgGrid = function (color) {
    var tmp = this.graph.gridSize * this.scale;

    while (tmp < this.minGridSize) {
      tmp *= 2;
    }

    var tmp2 = this.gridSteps * tmp;

    // Small grid lines
    var d = [];

    for (var i = 1; i < this.gridSteps; i++) {
      var tmp3 = i * tmp;
      d.push('M 0 ' + tmp3 + ' L ' + tmp2 + ' ' + tmp3 + ' M ' + tmp3 + ' 0 L ' + tmp3 + ' ' + tmp2);
    }

    // KNOWN: Rounding errors for certain scales (eg. 144%, 121% in Chrome, FF and Safari). Workaround
    // in Chrome is to use 100% for the svg size, but this results in blurred grid for large diagrams.
    var size = tmp2;
    var svg =
      '<svg width="' +
      size +
      '" height="' +
      size +
      '" xmlns="' +
      mxConstants.NS_SVG +
      '">' +
      '<defs><pattern id="grid" width="' +
      tmp2 +
      '" height="' +
      tmp2 +
      '" patternUnits="userSpaceOnUse">' +
      '<path d="' +
      d.join(' ') +
      '" fill="none" stroke="' +
      color +
      '" opacity="0.2" stroke-width="1"/>' +
      '<path d="M ' +
      tmp2 +
      ' 0 L 0 0 0 ' +
      tmp2 +
      '" fill="none" stroke="' +
      color +
      '" stroke-width="1"/>' +
      '</pattern></defs><rect width="100%" height="100%" fill="url(#grid)"/></svg>';

    return svg;
  };
}

(function () {
  initMxConstants();
  initHandleImage();
  initRotate();
  initBackGround();
})();
const initDrag = function (dragNode, graph, cell) {
  var graphF = function (evt) {
    var x = mxEvent.getClientX(evt);
    var y = mxEvent.getClientY(evt);
    var elt = document.elementFromPoint(x, y);

    if (mxUtils.isAncestorNode(graph.container, elt)) {
      return graph;
    }

    return null;
  };

  // Inserts a cell at the given location
  var funct = function (graph, evt, target, x, y) {
    var cells = graph.importCells([cell], x, y, target);

    if (cells != null && cells.length > 0) {
      graph.scrollCellToVisible(cells[0]);
      graph.setSelectionCells(cells);
    }
  };
  var ds = mxUtils.makeDraggable(dragNode, graphF, funct);
  ds.isGuidesEnabled = function () {
    return graph.graphHandler.guidesEnabled;
  };
  ds.createDragElement = mxDragSource.prototype.createDragElement;
};
const createShape = function (sideNode, graph, style, width, height) {
  const cell = new mxCell('', new mxGeometry(0, 0, width, height), style);
  cell.vertex = true;
  graph.addCells([cell]);
  const node = graph.view.getCanvas().ownerSVGElement.cloneNode(true);
  node.style.width = width + 2 + 'px';
  node.style.height = height + 2 + 'px';
  node.style.minWidth = null;
  node.style.minHeight = null;
  node.style.backgroundImage = null;
  graph.getModel().clear();
  sideNode.appendChild(node);
  initDrag(node, graph, cell);
};

const initShapes = function (sideNode, graph) {
  createShape(sideNode, graph, 'rounded=0;whiteSpace=wrap;html=1', 100, 100);
  createShape(sideNode, graph, 'rounded=1;whiteSpace=wrap;html=1', 100, 100);
  createShape(sideNode, graph, 'shape=rhombus;whiteSpace=wrap;html=1;', 100, 100);
  createShape(sideNode, graph, 'shape=cloud;perimeter=parallelogramPerimeter;whiteSpace=wrap;html=1;fixedSize=1;', 150, 100);
  createShape(sideNode, graph, 'shape=triangle;whiteSpace=wrap;html=1;', 50, 100);
};

export default function initPorts(graph) {
  graph.setConnectable(true);
  graph.setAllowDanglingEdges(false);
  graph.setMultigraph(false);
  // Disables automatic handling of ports. This disables the reset of the
  // respective style in mxGraph.cellConnected. Note that this feature may
  // be useful if floating and fixed connections are combined.
  graph.setPortsEnabled(false);

  // Enables rubberband selection
  // new mxRubberband(graph);

  // Gets the default parent for inserting new cells. This
  // is normally the first child of the root (ie. layer 0).
  // var parent = graph.getDefaultParent();

  // Ports are equal for all shapes...
  var ports = new Array();

  // NOTE: Constraint is used later for orthogonal edge routing (currently ignored)
  ports['w'] = { x: 0, y: 0.5, perimeter: true, constraint: 'west' };
  ports['e'] = { x: 1, y: 0.5, perimeter: true, constraint: 'east' };
  ports['n'] = { x: 0.5, y: 0, perimeter: true, constraint: 'north' };
  ports['s'] = { x: 0.5, y: 1, perimeter: true, constraint: 'south' };
  ports['nw'] = { x: 0, y: 0, perimeter: true, constraint: 'north west' };
  ports['ne'] = { x: 1, y: 0, perimeter: true, constraint: 'north east' };
  ports['sw'] = { x: 0, y: 1, perimeter: true, constraint: 'south west' };
  ports['se'] = { x: 1, y: 1, perimeter: true, constraint: 'south east' };

  // ... except for triangles
  var ports2 = new Array();

  // NOTE: Constraint is used later for orthogonal edge routing (currently ignored)
  ports2['in1'] = { x: 0, y: 0, perimeter: true, constraint: 'west' };
  ports2['in2'] = { x: 0, y: 0.25, perimeter: true, constraint: 'west' };
  ports2['in3'] = { x: 0, y: 0.5, perimeter: true, constraint: 'west' };
  ports2['in4'] = { x: 0, y: 0.75, perimeter: true, constraint: 'west' };
  ports2['in5'] = { x: 0, y: 1, perimeter: true, constraint: 'west' };

  ports2['out1'] = { x: 0.5, y: 0, perimeter: true, constraint: 'north east' };
  ports2['out2'] = { x: 1, y: 0.5, perimeter: true, constraint: 'east' };
  ports2['out3'] = { x: 0.5, y: 1, perimeter: true, constraint: 'south east' };

  // Extends shapes classes to return their ports
  mxShape.prototype.getPorts = function () {
    return ports;
  };

  mxTriangle.prototype.getPorts = function () {
    return ports2;
  };

  // Disables floating connections (only connections via ports allowed)
  graph.connectionHandler.isConnectableCell = function (cell) {
    return false;
  };
  mxEdgeHandler.prototype.isConnectableCell = function (cell) {
    return graph.connectionHandler.isConnectableCell(cell);
  };

  // Disables existing port functionality
  graph.view.getTerminalPort = function (state, terminal, source) {
    return terminal;
  };

  // Returns all possible ports for a given terminal
  graph.getAllConnectionConstraints = function (terminal, source) {
    if (terminal != null && terminal.shape != null && terminal.shape.stencil != null) {
      // for stencils with existing constraints...
      if (terminal.shape.stencil != null) {
        return terminal.shape.stencil.constraints;
      }
    } else if (terminal != null && this.model.isVertex(terminal.cell)) {
      if (terminal.shape != null) {
        var ports = terminal.shape.getPorts();
        var cstrs = new Array();

        for (var id in ports) {
          var port = ports[id];

          var cstr = new mxConnectionConstraint(new mxPoint(port.x, port.y), port.perimeter);
          cstr.id = id;
          cstrs.push(cstr);
        }

        return cstrs;
      }
    }

    return null;
  };

  // Sets the port for the given connection
  graph.setConnectionConstraint = function (edge, terminal, source, constraint) {
    if (constraint != null) {
      var key = source ? mxConstants.STYLE_SOURCE_PORT : mxConstants.STYLE_TARGET_PORT;

      if (constraint == null || constraint.id == null) {
        this.setCellStyles(key, null, [edge]);
      } else if (constraint.id != null) {
        this.setCellStyles(key, constraint.id, [edge]);
      }
    }
  };

  // Returns the port for the given connection
  graph.getConnectionConstraint = function (edge, terminal, source) {
    var key = source ? mxConstants.STYLE_SOURCE_PORT : mxConstants.STYLE_TARGET_PORT;
    var id = edge.style[key];

    if (id != null) {
      var c = new mxConnectionConstraint(null, null);
      c.id = id;
      return c;
    }
    return null;
  };

  // Returns the actual point for a port by redirecting the constraint to the port
  let graphGetConnectionPoint = graph.getConnectionPoint;
  graph.getConnectionPoint = function (vertex, constraint) {
    if (constraint.id != null && vertex != null && vertex.shape != null) {
      var port = vertex.shape.getPorts()[constraint.id];

      if (port != null) {
        constraint = new mxConnectionConstraint(new mxPoint(port.x, port.y), port.perimeter);
      }
    }

    return graphGetConnectionPoint.apply(this, [vertex, constraint]);
  };
}

export function initGraph(graphElement, shapeElement) {
  const graph = new Graph(graphElement.nativeElement);
  mxGraphView.prototype.gridSteps = 4;
  graph.gridSize = 20;
  mxGraphView.prototype.minGridSize = 4;

  initShapes(shapeElement.nativeElement, graph);
  initPorts(graph);
  // Enables rubberband selection
  new mxRubberband(graph);
}
