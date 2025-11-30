import { MeshNode, RoutePath } from '../types';



export class RoutingService {
    // BFS for unweighted shortest path (hop count)
    static findPath(nodes: Map<string, MeshNode>, startNodeId: string, endNodeId: string): RoutePath | null {
        if (!nodes.has(startNodeId) || !nodes.has(endNodeId)) return null;

        const queue: string[] = [startNodeId];
        const visited: Set<string> = new Set([startNodeId]);
        const parent: Map<string, string> = new Map();

        while (queue.length > 0) {
            const currentId = queue.shift()!;

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

    private static reconstructPath(parent: Map<string, string>, endNodeId: string): RoutePath {
        const path: string[] = [endNodeId];
        let current = endNodeId;

        while (parent.has(current)) {
            current = parent.get(current)!;
            path.unshift(current);
        }

        return {
            path,
            hops: path.length - 1,
            estimatedLatency: (path.length - 1) * 50 // Assume 50ms per hop
        };
    }
}
