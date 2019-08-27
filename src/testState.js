export default {
    contextMenu: {
        isOpen: false,
        x: 0,
        y: 0
    },
    draftConnection: {
        isActive: false,
        from: { nodeID: 0, socket: 0 }
    },
    mouse: {
        x: 0,
        y: 0
    },
    drag: {
        isActive: false,
        nodeIndex: null
    },
    nodes: [
        {
            type: 'rgbPicker',
            title: 'Pen Output',
            id: '1',
            x: 660,
            y: 540,
            width: 160,
            height: 80,
            inputs: [],
            outputs: [
                { label: 'Color', value: [0,0,0], id: 1, type: 'color' }
            ]
        },
        {
            type: 'pen',
            title: 'Pen Output',
            id: 'pen',
            x: 960,
            y: 500,
            width: 160,
            height: 80,
            inputs: [
                { label: 'Radius', value: 0, id: 0 },
                { label: 'Fill', value: 0, id: 1, type: 'color' }
            ]
        },
        {
            type: 'data',
            title: 'Drawing Info',
            id: 'data',
            x: 60,
            y: 250,
            width: 160,
            height: 90,
            outputs: [
                { label: 'Distance', value: 0, id: 0, type: '' },
                { label: 'Pen X', value: 0, id: 1, type: '' },
                { label: 'Pen Y', value: 0, id: 2, type: '' }
            ]
        },
    ],
    connections: [
        {from: {nodeID: 'data', socket: 0}, to: {nodeID: 'pen', socket: 0}},
        {from: {nodeID: '1', socket: 0}, to: {nodeID: 'pen', socket: 1}},
    ]
}