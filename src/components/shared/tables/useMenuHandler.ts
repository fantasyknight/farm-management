import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { isModal } from '../../../store/ui/ui.actions';
import { setIdDeleteItem } from '../../../store/farms/farms.actions';

const useMenuHandler = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const redirectToFarm = (idFarm: string) => {
    history.push(`/farms/${idFarm}`);
  };

  const redirectToLine = (idFarm: string, idLine: string) => {
    history.push(`/farms/${idFarm}/${idLine}`);
  };

  const redirectToEditFarm = (idFarm: string) => {
    history.push(`/farms/farm-edit/${idFarm}`);
  };

  const onDelete = (
    rowData: any,
    column: string,
    isRedirect: string,
    lineId: string,
  ) => {
    dispatch(
      setIdDeleteItem({
        id: rowData.id,
        type: column,
        isRedirect,
        lineId,
      }),
    );
    dispatch(isModal({ activeModal: true }));
  };

  return { onDelete, redirectToFarm, redirectToLine, redirectToEditFarm };
};

export default useMenuHandler;
