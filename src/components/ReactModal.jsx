import Modal from 'react-modal';
import { IoClose } from 'react-icons/io5';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '95%',
        maxWidth: '600px',
        zIndex: 9999
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 9998
    },
};

Modal.setAppElement('#root');

function ReactModal({ children, modalIsOpen, closeModal }) {
    return (
      <Modal
            isOpen={modalIsOpen}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
                <IoClose size={24} /> 
            </button>

            <div>
                {children}
            </div>
        </Modal>
    );
}

export default ReactModal;
