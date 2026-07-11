const hours = ["h8", "h9", "h10", "h11", "h13", "h14", "h15", "h16", "h17", "h18"];

const emptyHours = () => Object.fromEntries(hours.map((hour) => [hour, null]));

let lineData = {
    id: "tv-line-1",
    line: "1",
    worker: 24,
    helper: 3,
    orders: [
        {
            id: 101,
            orderNo: "STYLE-1001",
            status: "ACTIVE",
            orderQty: 1200,
            totalInLine: 820,
            totalOutput: 468,
            orderInline: 352,
            balanceInLine: 352,
            qcRepairBack: 6,
            balanceDay: 4,
            input: 850,
            wHour: 10,
            hTarg: 60,
            startDate: "2026-07-01",
            finishDate: "2026-07-14",
            dailyRecords: [
                { id: 1001, date: "2026-07-10", dTarg: 570, h8: 55, h9: 58, h10: 57, h11: 60, h13: 56, h14: 59, h15: 58, h16: 57, h17: 56, h18: 54, isToday: false },
                { id: 1002, date: "2026-07-11", dTarg: 600, h8: 58, h9: 61, h10: 59, h11: 62, h13: null, h14: null, h15: null, h16: null, h17: null, h18: null, isToday: true },
            ],
            defects: { h8: 1, h9: 0, h10: 2, h11: 1, h13: null, h14: null, h15: null, h16: null, h17: null, h18: null },
        },
        {
            id: 102,
            orderNo: "STYLE-1002",
            status: "ACTIVE",
            orderQty: 900,
            totalInLine: 300,
            totalOutput: 126,
            orderInline: 174,
            balanceInLine: 174,
            qcRepairBack: 2,
            balanceDay: 2,
            input: 330,
            wHour: 10,
            hTarg: 48,
            startDate: "2026-07-11",
            finishDate: "2026-07-18",
            dailyRecords: [
                { id: 2001, date: "2026-07-11", dTarg: 480, h8: 42, h9: 45, h10: 39, h11: null, h13: null, h14: null, h15: null, h16: null, h17: null, h18: null, isToday: true },
            ],
            defects: { h8: 0, h9: 1, h10: 0, h11: null, h13: null, h14: null, h15: null, h16: null, h17: null, h18: null },
        },
        {
            id: 103,
            orderNo: "STYLE-1003",
            status: "ACTIVE",
            orderQty: 1500,
            totalInLine: 0,
            totalOutput: 0,
            orderInline: 0,
            balanceInLine: 0,
            qcRepairBack: 0,
            balanceDay: 5,
            input: 0,
            wHour: 10,
            hTarg: 55,
            startDate: "2026-07-15",
            finishDate: "2026-07-25",
            dailyRecords: [
                { id: 3001, date: "2026-07-11", dTarg: 550, ...emptyHours(), isToday: true },
            ],
            defects: emptyHours(),
        },
    ],
};

const wait = (value) => new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), 250));

export async function getMockTvLine() {
    return wait(lineData);
}

// Mock response for GET /tvs/{name} when one physical line has two styles.
// TVLineDisplay uses activeOrderId first, then rotates through both orders.
export async function getMockTvLineDisplay() {
    const orders = lineData.orders.slice(0, 2).map((order) => {
        const start = order.startDate ? new Date(`${order.startDate}T00:00:00`) : null;
        const today = new Date("2026-07-11T00:00:00");
        const day = start ? Math.floor((today - start) / 86400000) + 1 : null;
        return { ...order, day };
    });

    return wait({
        id: lineData.id,
        name: "TV-LINE-1",
        line: lineData.line,
        worker: lineData.worker,
        helper: lineData.helper,
        activeOrderId: orders[0]?.id ?? null,
        orders,
    });
}

export async function saveMockOrder(order) {
    lineData.orders = lineData.orders.map((item) => item.id === order.id ? structuredClone(order) : item);
    return wait(order);
}

export async function createMockOrder(orderNo) {
    const order = {
        id: Date.now(), orderNo, status: "ACTIVE", orderQty: 0, totalInLine: 0,
        totalOutput: 0, orderInline: 0, balanceInLine: 0, qcRepairBack: 0,
        balanceDay: 0, input: 0, wHour: 10, hTarg: 0, startDate: null,
        finishDate: null,
        dailyRecords: [{ id: Date.now() + 1, date: "2026-07-11", dTarg: null, ...emptyHours(), isToday: true }],
        defects: emptyHours(),
    };
    lineData.orders.push(order);
    return wait(order);
}

export async function createMockDailyRecord(orderId, date) {
    const order = lineData.orders.find((item) => item.id === orderId);
    if (!order) throw new Error("Order not found");

    const record = {
        id: Date.now(),
        date,
        dTarg: null,
        ...emptyHours(),
        isToday: true,
    };

    order.dailyRecords = [
        ...order.dailyRecords.map((item) => ({ ...item, isToday: false })),
        record,
    ];
    return wait(record);
}
