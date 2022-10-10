import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Radio } from 'antd';

import { RadioChangeEvent } from 'antd/lib/radio';
import { IRootState } from '../store/rootReducer';
import Header from '../components/header/Header';

import {
  ITab,
  IBreadcrumb,
  IList,
  INavbar,
  IMainList,
} from '../types/basicComponentsTypes';
import {
  DollarIcon,
  Dropdown,
  Input,
  Button,
  Caption,
  Subtitle,
  Title,
  Feedback,
  ModalComponent,
  RadioButton,
  ToggleButton,
  CheckboxButton,
  Paragrapgh,
  CaretRight,
  CaretLeft,
  ChevronRight,
  TabsComponent,
  BreadcrumbComponent,
  StepsComponent,
  Navbar,
  UserIcon,
  Tooltip,
  TagComponent,
  Datepicker,
  InputModal,
  Tables,
} from '../components/shared';
import IconModal from '../components/shared/modal/IconModal';

function UiPage() {
  const dispatch = useDispatch();
  const random = useSelector((state: IRootState) => state.auth);
  const store = useStore();
  const [value, setValue] = useState('');
  const [current, setCurrent] = useState(1);
  const [firstModal, setFirstModal] = useState(false);
  const [secondModal, setSecondModal] = useState(false);
  const [thirdModal, setThirdModal] = useState(false);
  const [forthModal, setForthModal] = useState(false);
  const [fifthModal, setFifthModal] = useState(false);
  const [valueRadio, setRadioValue] = useState(3);

  const onChangeRadio = (e: RadioChangeEvent) => {
    setRadioValue(e.target.value);
  };

  useEffect(() => {}, [dispatch]);

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

  const onCurrentChange = (e: number) => {
    setCurrent(e);
  };

  const showModal = () => {
    setFirstModal(!firstModal);
  };

  const showSecondModal = () => {
    setSecondModal(!secondModal);
  };

  const showThirdModal = () => {
    setThirdModal(!thirdModal);
  };

  const showForthModal = () => {
    setForthModal(!forthModal);
  };

  const showFifthModal = () => {
    setFifthModal(!fifthModal);
  };

  const items: IMainList[] = [
    { value: 'Label1', label: 'Label1', id: 'tesx' },
    { value: 'Label2', label: 'Label2', id: 'ewrwer' },
    { value: 'Label3', label: 'Label3', id: 'fdgdfg' },
  ];

  const tabItems: ITab[] = [
    { content: <p>Tab 1</p>, title: 'tab', id: '123' },
    { content: <p>Tab 2</p>, title: 'tab', id: '321' },
    { content: <p>Tab 3</p>, title: 'tab', id: '234' },
  ];

  const breadcrumIbtems: IBreadcrumb[] = [
    { link: '', linkName: 'Page Name', id: '456' },
    { link: '', linkName: 'Page Name', id: '678' },
    { link: '', linkName: 'Page Name', id: '345' },
  ];

  const stepsItems: IList[] = [
    { title: 'Step', id: '3434' },
    { title: 'Step', id: '5454' },
    { title: 'Step', id: '7666' },
    { title: 'Step', id: '8766' },
  ];

  const tooltipItems: IList[] = [
    { title: 'Tooltip text goes here', id: '3434' },
    { title: 'Tooltip text goes here', id: '5454' },
    { title: 'Tooltip text goes here', id: '7666' },
    { title: 'Tooltip text goes here', id: '8766' },
  ];

  const navbarItems: INavbar[] = [
    { title: 'Navbar', icon: <UserIcon />, link: '/login', id: '868768' },
    { title: 'Navbar', icon: <UserIcon />, link: '/', id: '456456' },
  ];

  return (
    <>
      <Header />
      <div className='App container'>
        <Title
          size={1}
          color='black'
          className='mt-16 mb-16'
          align='center'
          fontWeight={700}
        >
          Typography
        </Title>
        <Title size={3} color='black' align='left' fontWeight={500}>
          Heading 3
        </Title>
        <Title size={6} color='black' align='left' fontWeight={500}>
          Heading 6
        </Title>
        <Subtitle size={1} color='black' align='left' fontWeight={400}>
          Subtitle 1
        </Subtitle>
        <Subtitle size={2} color='black' align='left' fontWeight={600}>
          Subtitle 2
        </Subtitle>
        <Paragrapgh size={1} color='black' align='left' fontWeight={500}>
          Text 1
        </Paragrapgh>
        <Paragrapgh size={2} color='black' align='left' fontWeight={700}>
          Text 2
        </Paragrapgh>
        <Caption size={1} color='black' align='left' fontWeight={500}>
          Caption 1
        </Caption>
        <Caption size={2} color='black' align='left' fontWeight={700}>
          Caption 2
        </Caption>
        <Title
          size={6}
          color='black'
          className='mt-16 mb-16'
          align='center'
          fontWeight={600}
        >
          Buttons
        </Title>
        <Button
          className='mt-10'
          color='blue'
          size={1}
          width='wide'
          type='fill'
        >
          Blue
        </Button>
        <Button
          color='green'
          className='ml-6 mr-6 mt-10'
          size={1}
          width='middle'
          type='fill'
        >
          Green
        </Button>
        <Button color='red' className='ml-6' size={1} width='small' type='fill'>
          Red
        </Button>
        <Button
          color='orange'
          className='ml-6 mt-10'
          size={1}
          width='small'
          type='fill'
        >
          Orange
        </Button>
        <Button
          color='red'
          className='ml-6 mt-10'
          disabled
          size={1}
          width='small'
          type='fill'
        >
          Red
        </Button>

        <Button
          color='blue'
          className='ml-6 mt-10'
          size={3}
          width='small'
          type='bordered'
        >
          Border
        </Button>
        <Button
          color='red'
          className='ml-6 mt-10'
          size={2}
          width='small'
          type='bordered'
        >
          Border
        </Button>
        <Button
          color='green'
          className='ml-6 mt-10'
          size={2}
          width='small'
          type='bordered'
        >
          Border
        </Button>
        <Button
          color='orange'
          className='ml-6 mt-10'
          size={2}
          width='small'
          type='bordered'
        >
          Border
        </Button>
        <Button
          color='orange'
          className='ml-6 mt-10'
          size={2}
          disabled
          width='middle'
          type='bordered'
        >
          Border
        </Button>
        <Button
          color='blue'
          className='ml-6 mt-10'
          size={3}
          width='small'
          type='transparent'
        >
          Blue
        </Button>
        <Button
          color='red'
          className='ml-6 mt-10'
          size={3}
          width='small'
          type='transparent'
        >
          Red
        </Button>
        <Button
          color='green'
          className='ml-6 mt-10'
          size={3}
          width='small'
          type='transparent'
        >
          Green
        </Button>
        <Button
          color='orange'
          className='ml-6 mt-10'
          size={3}
          width='small'
          type='transparent'
        >
          Orange
        </Button>
        <Button
          color='orange'
          className='ml-6 mt-10'
          size={2}
          width='small'
          disabled
          type='transparent'
        >
          Orange
        </Button>
        <Button
          color='black'
          className='ml-6 mt-10'
          size={0}
          width='default'
          type='default'
          iconOnly
        >
          <CaretRight />
        </Button>
        <Button
          color='blue'
          className='ml-6 mt-10'
          size={1}
          width='small'
          type='fill'
          iconLeft
        >
          <span className='ml-8 mr-16'>
            <CaretLeft />
          </span>
          <span>Blue</span>
        </Button>
        <Button
          color='blue'
          className='ml-6 mt-10'
          size={1}
          width='small'
          type='fill'
          iconRight
        >
          <span>Blue</span>
          <span className='mr-8 ml-16'>
            <ChevronRight />
          </span>
        </Button>
        <Button
          color='orange'
          className='ml-6 mt-10'
          size={1}
          width='small'
          type='fill'
          iconRight
        >
          <span>Orange</span>
          <span className='mr-8 ml-16'>
            <ChevronRight />
          </span>
        </Button>
        <Button
          color='blue'
          className='ml-6 mt-10'
          size={1}
          width='small'
          type='transparent'
          iconRight
        >
          <span>Blue</span>
          <span className='mr-8 ml-16'>
            <ChevronRight />
          </span>
        </Button>
        <Button
          color='red'
          className='ml-6 mt-10'
          size={1}
          width='small'
          type='bordered'
          iconLeft
        >
          <span className='ml-8 mr-16'>
            <CaretLeft />
          </span>
          <span>Red</span>
        </Button>
        <Input
          onChange={onChange}
          type='date'
          value={value}
          label='Date'
          placeholder='placeholder'
        />
        <Input
          onChange={onChange}
          type='email'
          value={value}
          label='Email'
          placeholder='placeholder'
          onValidate={(e: boolean) => console.log('e', e)}
        />
        <Input
          onChange={onChange}
          type='password'
          value={value}
          label='Password'
          onValidate={(e: boolean) => console.log('e', e)}
          placeholder='placeholder'
        />
        <Input
          onChange={onChange}
          type='text'
          value={value}
          label='Required'
          placeholder='placeholder'
          required
        />
        <Input
          type='text'
          onChange={onChange}
          value={value}
          label='label'
          placeholder='placeholder'
        />
        <Input
          onChange={onChange}
          value={value}
          label='label'
          type='date'
          placeholder='placeholder'
          disabled
        />
        <Input
          onChange={onChange}
          unit={<DollarIcon />}
          type='number'
          value={value}
          label='label'
          placeholder='placeholder'
        />
        <Input
          onChange={onChange}
          unit='ha'
          type='text'
          value={value}
          label='label'
          placeholder='placeholder'
        />
        <Input
          label='label'
          type='textarea'
          value={value}
          onChange={onChange}
          placeholder='placeholder'
        />
        <Dropdown placeholder='placeholder' label='Title' options={items} />
        <Radio.Group
          className='d-flex mb-32 mt-32'
          onChange={onChangeRadio}
          value={valueRadio}
        >
          <RadioButton label='Regular' value={1} />
          <RadioButton label='Hover' value={2} />
          <RadioButton label='Selected' value={3} />
          <RadioButton label='Disabled' value={4} disabled />
          <RadioButton label='Error' value={5} isError />
        </Radio.Group>
        <div className='w-50 mt-16 mb-16'>
          <Radio.Group
            className='w-100 mb-32 mt-32'
            onChange={onChangeRadio}
            value={valueRadio}
          >
            <RadioButton label='Regular' isfullWidth isLeftText value={1} />
            <RadioButton label='Hover' isfullWidth isLeftText value={2} />
            <RadioButton label='Selected' isfullWidth value={3} />
            <RadioButton label='Disabled' isfullWidth value={4} disabled />
          </Radio.Group>
        </div>
        <div className='d-flex mb-32'>
          <CheckboxButton label='Regular' onChange={e => console.log(e)} />
          <CheckboxButton label='Selected' onChange={e => console.log(e)} />
          <CheckboxButton
            label='Negative'
            isNegative
            onChange={e => console.log(e)}
          />
          <CheckboxButton
            label='Disabled'
            disabled
            onChange={e => console.log(e)}
          />
          <CheckboxButton
            label='Error'
            isError
            onChange={e => console.log(e)}
          />
        </div>
        <div className='w-30 mt-16 mb-16'>
          <CheckboxButton
            label='Full width'
            isfullWidth
            onChange={e => console.log(e)}
          />
        </div>
        <div className='w-30 mt-16 mb-16'>
          <CheckboxButton
            label='Full width and left'
            isfullWidth
            isLeftText
            onChange={e => console.log(e)}
          />
        </div>
        <div className='d-flex mb-32'>
          <ToggleButton label='Default' onChange={e => console.log(e)} />
          <ToggleButton
            label='Enabled'
            defaultChecked
            onChange={e => console.log(e)}
          />
          <ToggleButton
            label='Disabled'
            disabled
            onChange={e => console.log(e)}
          />
        </div>
        <div className='w-50 mt-16 mb-16'>
          <ToggleButton
            label='Full width and left'
            isfullWidth
            isLeftText
            onChange={e => console.log(e)}
          />
        </div>
        <div className='w-50 mt-16 mb-16'>
          <ToggleButton
            label='Full width'
            isfullWidth
            onChange={e => console.log(e)}
          />
        </div>
        <TabsComponent defaultActiveKey='321' items={tabItems} />
        <BreadcrumbComponent items={breadcrumIbtems} />
        <StepsComponent
          className='mt-16 mb-16'
          current={current}
          onChange={e => setCurrent(e)}
          direction='vertical'
          items={stepsItems}
        />
        <div className='w-50'>
          <StepsComponent
            className='mt-16 mb-16'
            current={current}
            onChange={onCurrentChange}
            direction='horizontal'
            items={stepsItems}
          />
        </div>
        <Navbar
          className='mt-16 mb-16'
          current='868768'
          direction='vertical'
          items={navbarItems}
        />
        <div className='d-flex mt-16 mb-16'>
          <div className='w-20 mr-32 ml-32'>
            <Tooltip content={tooltipItems} position='bottom'>
              <p className='tooltip'>Tooltip Bottom</p>
            </Tooltip>
          </div>
          <div className='w-20 mr-32 ml-32'>
            <Tooltip content={tooltipItems} position='top'>
              <p className='tooltip'>Tooltip Top</p>
            </Tooltip>
          </div>
          <div className='w-20 mr-32 ml-32'>
            <Tooltip content={tooltipItems} position='left'>
              <p className='tooltip'>Tooltip Left</p>
            </Tooltip>
          </div>
          <div className='w-20 mr-32 ml-32'>
            <Tooltip content={tooltipItems} position='right'>
              <p className='tooltip'>Tooltip Right</p>
            </Tooltip>
          </div>
          <TagComponent className='mr-16 ml-16' color='green'>
            Tag
          </TagComponent>
          <TagComponent className='mr-16 ml-16' color='red'>
            Tag
          </TagComponent>
          <TagComponent className='mr-16 ml-16' color='orange'>
            Tag
          </TagComponent>
          <TagComponent className='mr-16 ml-16' color='gray'>
            Tag
          </TagComponent>
          <Datepicker
            className='mr-16 ml-16'
            label='Date'
            onChange={e => console.log('e', e)}
          />
        </div>
        <div className='d-flex mr-16 ml-16 mb-32'>
          <Datepicker
            className='mr-16 ml-16'
            label='Date'
            required
            onRange={e => console.log('e', e)}
            onChange={e => console.log('e', e)}
          />
          <Datepicker
            className='mr-16 ml-16'
            label='Date'
            disabled
            onChange={e => console.log('e', e)}
          />
        </div>
        <Feedback
          className='mt-4'
          message='Primary notification example'
          type='info'
          theme='dark'
        />
        <Feedback
          className='mt-4'
          message='Success notification example'
          type='success'
          theme='dark'
        />
        <Feedback
          className='mt-4'
          message='Error notification example'
          type='error'
          theme='dark'
        />
        <Feedback
          className='mt-4'
          message='Alert notification example'
          type='warning'
          theme='dark'
        />
        <Feedback
          className='mt-4'
          theme='dark'
          message='Neutral notification example'
          type='neutral'
        />
        <Feedback
          className='mt-4'
          theme='light'
          message='Primary notification example'
          type='info'
        />
        <Feedback
          isWithoutClosable
          theme='light'
          className='mt-4'
          message='Success notification example'
          type='success'
        />
        <Feedback
          theme='light'
          className='mt-4'
          message='Error notification example'
          type='error'
        />
        <Feedback
          isWithoutClosable
          isIcon
          theme='light'
          className='mt-4'
          message='Alert notification example'
          type='warning'
        />
        <Feedback
          theme='light'
          className='mt-4'
          message='Neutral notification example'
          type='neutral'
        />
        <Button
          className='mt-16 mb-16'
          color='blue'
          size={1}
          width='small'
          type='fill'
          onClick={showModal}
        >
          Open First Modal
        </Button>
        <IconModal
          visible={firstModal}
          onCancel={showModal}
          type='success'
          title='Modal dialog'
          text='This is place holder text. The basic dialog for modals should contain only valuable and relevant information. Simplify dialogs by removing unnecessary elements or content that does not support user tasks. If you find that the number of required elements for your design are making the dialog excessively large, then try a different design solution. '
        />
        <Button
          className='mt-16 mb-16 ml-10'
          color='blue'
          size={1}
          width='small'
          type='fill'
          onClick={showSecondModal}
        >
          Open Second Modal
        </Button>
        <ModalComponent
          visible={secondModal}
          onCancel={showSecondModal}
          warningText='213123123123'
          buttonText='Cancel subscription'
          type='warning'
          title='Warning'
          text='This is place holder text. The basic dialog for modals should contain only valuable and relevant information. Simplify dialogs by removing unnecessary elements or content that does not support user tasks. If you find that the number of required elements for your design are making the dialog excessively large, then try a different design solution. '
          onConfirm={() => console.log('onConfirm')}
        />
        <Button
          className='mt-16 mb-16 ml-10'
          color='blue'
          size={1}
          width='small'
          type='fill'
          onClick={showThirdModal}
        >
          Open Third Modal
        </Button>
        <ModalComponent
          visible={thirdModal}
          onCancel={showThirdModal}
          type='delete'
          title='Error / Delete '
          text='This is place holder text. The basic dialog for modals should contain only valuable and relevant information. Simplify dialogs by removing unnecessary elements or content that does not support user tasks. If you find that the number of required elements for your design are making the dialog excessively large, then try a different design solution. '
          onConfirm={() => console.log('onConfirm')}
        />
        <Button
          className='mt-16 mb-16 ml-10'
          color='blue'
          size={1}
          width='small'
          type='fill'
          onClick={showForthModal}
        >
          Open Forth Modal
        </Button>
        <InputModal
          visible={forthModal}
          onCancel={showForthModal}
          title='Title'
          type='confirm'
          onConfirm={() => console.log('onConfirm')}
        >
          <Input
            className='mb-24'
            type='text'
            onChange={onChange}
            value={value}
            label='label'
            placeholder='placeholder'
          />
        </InputModal>
        <Button
          className='mt-16 mb-16 ml-10'
          color='blue'
          size={1}
          width='small'
          type='fill'
          onClick={showFifthModal}
        >
          Open Fifth Modal
        </Button>
        <InputModal
          visible={fifthModal}
          onCancel={showFifthModal}
          title='Change password'
          type='confirm'
          onConfirm={() => console.log('onConfirm')}
        >
          <Input
            className='mb-16'
            type='password'
            onChange={onChange}
            value={value}
            label='New password'
            placeholder='placeholder'
          />
          <Input
            className='mb-24'
            type='password'
            onChange={onChange}
            value={value}
            label='Confirm password'
            placeholder='placeholder'
          />
        </InputModal>
      </div>
    </>
  );
}

export default UiPage;
