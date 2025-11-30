"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingService = void 0;
class RoutingService {
    // BFS for unweighted shortest path (hop count)
    static findPath(nodes, startNodeId, endNodeId) {
        if (!nodes.has(startNodeId) || !nodes.has(endNodeId))
            return null;
        const queue = [startNodeId];
        const visited = new Set([startNodeId]);
        const parent = new Map();
        while (queue.length > 0) {
            const currentId = queue.shift();
            if (currentId === endNodeId) {
                return this.reconstructPath(parent, endNodeId);
            }
            const currentNode = nodes.get(currentId);
            if (currentNode) {
                for (const neighborId of currentNode.neighbors) {
                    if (!visited.has(neighborId) && nodes.has(neighborId)) {
                        visited.add(neighborId);
                        parent.set(neighborId, currentId);
                        queue.push(neighborId);
                    }
                }
            }
        }
        return null;
    }
    static reconstructPath(parent, endNodeId) {
        const path = [endNodeId];
        let current = endNodeId;
        while (parent.has(current)) {
            current = parent.get(current);
            path.unshift(current);
        }
        return {
            path,
            hops: path.length - 1,
            estimatedLatency: (path.length - 1) * 50 // Assume 50ms per hop
        };
    }
}
exports.RoutingService = RoutingService;
