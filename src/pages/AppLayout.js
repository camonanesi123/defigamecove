import Header from 'components/header';
import Footer from 'components/footer';

const AppLayout = (props) => {
  return (
    <div className='app-layout'>
      <Header showItems={props.showItems} />
      {props.children}
      <Footer />
    </div>
  );
};

export default AppLayout;
