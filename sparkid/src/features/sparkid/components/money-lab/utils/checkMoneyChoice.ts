import type {
    MoneyCategory,
    MoneyProduct,
} from "../data/moneyProducts"

export type MoneyChoiceConnection = {
    id: string
    fromProductId: string
    toCategory: MoneyCategory
}

export type CheckMoneyChoiceInput = {
    connections: MoneyChoiceConnection[]
    products: MoneyProduct[]
}

export type CheckMoneyChoiceResult = {
    total: number
    connectedCount: number
    correctCount: number
    wrongCount: number
    unconnectedProductIds: string[]
    wrongConnections: {
        productId: string
        selectedCategory: MoneyCategory
        correctCategory: MoneyCategory
    }[]
    isComplete: boolean
}

export function checkMoneyChoice({
    connections,
    products,
}: CheckMoneyChoiceInput): CheckMoneyChoiceResult {
    const connectionByProduct = new Map(
        connections.map((connection) => [
            connection.fromProductId,
            connection,
        ]),
    )

    const wrongConnections: CheckMoneyChoiceResult["wrongConnections"] = []
    const unconnectedProductIds: string[] = []

    products.forEach((product) => {
        const connection = connectionByProduct.get(product.id)

        if (!connection) {
            unconnectedProductIds.push(product.id)
            return
        }

        if (connection.toCategory !== product.correctCategory) {
            wrongConnections.push({
                productId: product.id,
                selectedCategory: connection.toCategory,
                correctCategory: product.correctCategory,
            })
        }
    })

    const connectedCount = products.length - unconnectedProductIds.length
    const wrongCount = wrongConnections.length
    const correctCount = connectedCount - wrongCount

    return {
        total: products.length,
        connectedCount,
        correctCount,
        wrongCount,
        unconnectedProductIds,
        wrongConnections,
        isComplete: connectedCount === products.length && wrongCount === 0,
    }
}
