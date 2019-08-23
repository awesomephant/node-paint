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
            type: 'pen',
            title: 'Pen Output',
            id: 'pen',
            x: 960,
            y: 500,
            width: 160,
            height: 100,
            inputs: [
                { label: 'Radius', value: 35, id: 0 },
                { label: 'Fill', value: 0, id: 1, type: 'color' },
                { label: 'Hardness', value: 0, id: 2 }
            ]
        },
        {
            type: 'data',
            title: 'Drawing Info',
            id: 'data',
            x: 60,
            y: 70,
            width: 160,
            height: 150,
            outputs: [
                { label: 'Distance', value: 0, id: 0, type: '' },
                { label: 'Area', value: 0, id: 1, type: '' },
                { label: 'Direction', value: 0, id: 2, type: '' },
                { label: 'Pen X', value: 0, id: 3, type: '' },
                { label: 'Pen Y', value: 0, id: 4, type: '' },
                { label: 'Velocity', value: 5, id: 6, type: '' }
            ]
        },
        {
            type: 'number',
            title: 'Number',
            id: 'n1',
            x: 760,
            y: 370,
            width: 160,
            height: 100,
            outputs: [
                { label: 'Value', value: 35, id: 0, type: '' }
            ]
        },
    ],
    connections: [
        {id: 0, from: {nodeID: 'n1', socket: 0}, to: {nodeID: 'pen', socket: 0}}
    ]
}