import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeleteConfirmationModal from './DeleteConfirmationModal';

describe('DeleteConfirmationModal', () => {
  it('no se renderiza cuando isOpen es false', () => {
    render(<DeleteConfirmationModal isOpen={false} />);
    const modal = screen.queryByText('Confirmar Eliminación');
    expect(modal).not.toBeInTheDocument();
  });

  it('se renderiza correctamente cuando isOpen es true', () => {
    render(<DeleteConfirmationModal isOpen={true} />);
    expect(screen.getByText('Confirmar Eliminación')).toBeInTheDocument();
    expect(
      screen.getByText(
        '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('llama a onClose cuando se hace clic en el botón de cancelar', () => {
    const onCloseMock = vi.fn();
    render(<DeleteConfirmationModal isOpen={true} onClose={onCloseMock} />);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalledOnce();
  });

  it('llama a onConfirm cuando se hace clic en el botón de confirmar', () => {
    const onConfirmMock = vi.fn();
    render(<DeleteConfirmationModal isOpen={true} onConfirm={onConfirmMock} />);

    const confirmButton = screen.getByText('Eliminar');
    fireEvent.click(confirmButton);

    expect(onConfirmMock).toHaveBeenCalledOnce();
  });

  it('renderiza textos personalizados correctamente', () => {
    render(
      <DeleteConfirmationModal
        isOpen={true}
        title="Eliminar archivo"
        message="¿Seguro que deseas eliminar este archivo?"
        confirmText="Sí, eliminar"
        cancelText="No, cancelar"
      />
    );

    expect(screen.getByText('Eliminar archivo')).toBeInTheDocument();
    expect(screen.getByText('¿Seguro que deseas eliminar este archivo?')).toBeInTheDocument();
    expect(screen.getByText('Sí, eliminar')).toBeInTheDocument();
    expect(screen.getByText('No, cancelar')).toBeInTheDocument();
  });
});
