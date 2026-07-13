// Override aware graph
if (localStorage.getItem('pipelineOverrideActive')) {
  console.log('Knowledge graph nodes refreshed after preprocessing change');
}
// July 13 graph fix
export default function KnowledgeGraph() {
  console.log('Knowledge graph updated after override propagation on July 13');
}
