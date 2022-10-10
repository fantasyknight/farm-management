import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, useHistory } from 'react-router-dom';

import { IRootState } from '../store/rootReducer';
import { IUiState } from '../store/ui/ui.type';
import {
  getFarmsData,
  deleteItems,
  hideFeedback,
} from '../store/farms/farms.actions';
import { isModal } from '../store/ui/ui.actions';

import Farms from './Farms';
import Farm from './Farm';
import FarmLine from './FarmLine/FarmLine';
import AddLines from './AddLines';
import FarmsForm from './FarmsForm';
import { Feedback, ModalComponent } from '../components/shared';
import { IFarmState } from '../store/farms/farms.type';

const FarmsRouter = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const uiModal = useSelector<IRootState, IUiState['isModal']>(
    state => state.ui.isModal,
  );
  const [disableBtn, setDisableBtn] = useState(false);

  const allFeedback = useSelector<IRootState, IFarmState['allFeedback']>(
    state => state.farms.allFeedback,
  );

  const handleOnDelete = async () => {
    setDisableBtn(true);
    await dispatch(deleteItems(history));
    setDisableBtn(false);
  };

  useEffect(() => {
    dispatch(getFarmsData(history));
  }, []);

  return (
    <div>
      <Switch>
        <Route exact path='/farms/farm-:id/:idFarm?'>
          <FarmsForm />
        </Route>
        <Route exact path='/farms/:idFarm/add-line'>
          <AddLines />
        </Route>
        <Route exact path='/farms/:idFarm'>
          <Farm />
        </Route>
        <Route exact path='/farms/:idFarm/:idLine'>
          <FarmLine />
        </Route>
        <Route exact path='/farms'>
          <Farms />
        </Route>
      </Switch>
      <ModalComponent
        visible={uiModal.activeModal}
        onCancel={() => dispatch(isModal({ activeModal: false }))}
        type='delete'
        title='Error / Delete '
        text={`${uiModal.textModal}`}
        onConfirm={handleOnDelete}
        disabled={disableBtn}
      />
      {allFeedback.map((feedback: any, i: number) => {
        const top = i * 86;
        if (feedback.isMessage) {
          return (
            <Feedback
              message={feedback.message}
              type={feedback.type}
              theme='light'
              position={!top ? 16 : top}
              isGlobal
              key={feedback.id}
              onClose={() => dispatch(hideFeedback(feedback.id))}
            />
          );
        }

        return '';
      })}
    </div>
  );
};

export default FarmsRouter;
