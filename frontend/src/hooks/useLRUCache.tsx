class Node<K, V> {
    key: K;
    value: V;
    prev: Node<K, V> | null;
    next: Node<K, V> | null;

    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

export class LRUCache<K, V> {
    private capacity: number;
    private map: Map<K, Node<K, V>>;
    private head: Node<K, V> | null;
    private tail: Node<K, V> | null;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.map = new Map();
        this.head = null;
        this.tail = null;
    }

    get(key: K): V | null {
        if (!this.map.has(key)) {
            return null; // Key not found
        }

        const node = this.map.get(key)!; // Get the node
        this.moveToHead(node); // Move the accessed node to the head
        return node.value; // Return the value
    }

    put(key: K, value: V): void {
        if (this.map.has(key)) {
            const node = this.map.get(key)!;
            node.value = value; // Update the value
            this.moveToHead(node); // Move the updated node to the head
        } else {
            const newNode = new Node(key, value);
            this.map.set(key, newNode); // Add the new node to the map
            this.addNode(newNode); // Add the new node to the linked list

            if (this.map.size > this.capacity) {
                this.removeLRU(); // Remove the least recently used item
            }
        }
    }

    private moveToHead(node: Node<K, V>): void {
        this.removeNode(node);
        this.addNode(node);
    }

    private addNode(node: Node<K, V>): void {
        node.prev = null;
        node.next = this.head;

        if (this.head) {
            this.head.prev = node;
        }

        this.head = node;

        if (!this.tail) {
            this.tail = node; // If the list was empty, set tail to the new node
        }
    }

    private removeNode(node: Node<K, V>): void {
        if (node.prev) {
            node.prev.next = node.next;
        }

        if (node.next) {
            node.next.prev = node.prev;
        }

        if (node === this.head) {
            this.head = node.next; // Move head if necessary
        }

        if (node === this.tail) {
            this.tail = node.prev; // Move tail if necessary
        }
    }

    private removeLRU(): void {
        if (!this.tail) return;

        this.map.delete(this.tail.key); // Remove from the map
        this.removeNode(this.tail); // Remove from the linked list
    }
}

export const useLRUCache = <K, V>(capacity: number): LRUCache<K, V> => {
    return new LRUCache<K, V>(capacity);
};
