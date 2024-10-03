import useIsEdgesHiddenStore from "@store/useIsEdgesHiddenStore";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

const useToggleShowAllEdges = () => {
  const { toggleEdgesHidden, isEdgesHidden } = useIsEdgesHiddenStore();
  const { setEdges, setNodes } = useReactFlow();

  const toggleShowAllEdges = useCallback(() => {
    setEdges((currentEdges) =>
      currentEdges.map((edge) => ({
        ...edge,
        hidden: !isEdgesHidden,
        animated: false,
      }))
    );
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isHandlesHidden: !isEdgesHidden,
          isSelected: false,
        },
      }))
    );
    toggleEdgesHidden();
  }, [isEdgesHidden, setEdges, toggleEdgesHidden, setNodes]);

  return { isEdgesHidden, toggleShowAllEdges };
};

export default useToggleShowAllEdges;
