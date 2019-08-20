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
            x: 660,
            y: 500,
            width: 160,
            height: 100,
            inputs: [
                { label: 'Radius', value: 0, id: 0 },
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
            height: 130,
            outputs: [
                { label: 'Total Distance', value: 0, id: 0, type: '' },
                { label: 'Total Area', value: 0, id: 1, type: '' },
                { label: 'Direction', value: 0, id: 2, type: '' },
                { label: 'Mouse Position', value: 0, id: 3, type: 'vector' },
                { label: 'Mouse Velocity', value: 0, id: 4, type: 'vector' }
            ]
        },
    ],
    connections: [
    ]
}