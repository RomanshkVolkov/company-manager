import { Terminal } from '@prisma/client';
import { useState } from 'react';
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Select,
  SelectItem,
  Selection,
} from '@nextui-org/react';
import { motion } from 'framer-motion';
import { PrinterIcon, TrashIcon } from '@heroicons/react/24/outline';
import Fields from '../../common/fields';
import FieldsWrapper from '../../common/fields-wrapper';
import FormLegend from '../../common/form-legend';

export default function Terminals({
  terminals,
  error,
  userTerminals,
}: {
  terminals: Terminal[];
  error: string | undefined;
  userTerminals?: Terminal[];
}) {
  const [selectedTerminals, setSelectedTerminals] = useState<Selection>(
    new Set(userTerminals?.map((terminal) => terminal.id) || [])
  );
  //Delete from set
  const handleDelete = (value: string) => {
    const newSelectedTerminals = new Set(selectedTerminals);
    newSelectedTerminals.delete(value);
    setSelectedTerminals(newSelectedTerminals);
  };

  return (
    <div data-testid="terminals">
      <div className="mb-6 md:flex">
        <FormLegend icon={PrinterIcon}>Terminales</FormLegend>
        <Select
          id="terminals"
          name="terminals"
          label="Selecciona las terminales"
          className="ml-auto h-full max-w-80"
          selectedKeys={selectedTerminals}
          onSelectionChange={setSelectedTerminals}
          isInvalid={error !== undefined}
          errorMessage={error}
          selectionMode="multiple"
        >
          {terminals.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </Select>
      </div>
      <FieldsWrapper>
        <Fields>
          <Table
            aria-label="Company emails"
            removeWrapper
            data-testid="terminals-table"
          >
            <TableHeader>
              <TableColumn>NOMBRE O ID</TableColumn>
              <TableColumn className="text-center">Eliminar</TableColumn>
            </TableHeader>
            <TableBody>
              {terminals
                .filter((terminal) => {
                  if (selectedTerminals === 'all') return true;
                  return selectedTerminals.has(terminal.id);
                })
                .map((terminal, index) => (
                  <TableRow key={terminal.id}>
                    <TableCell className="p-1 pl-0">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Input
                          data-testid={`terminal-${index}`}
                          aria-label={`Terminal número ${index + 1}`}
                          radius="sm"
                          size="sm"
                          id={`terminal-${index}`}
                          name={`terminal-${index}`}
                          defaultValue={terminal.name}
                          isReadOnly
                        />
                      </motion.div>
                    </TableCell>
                    <TableCell className="text-center">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Button
                          size="sm"
                          color="danger"
                          variant="shadow"
                          isIconOnly
                          onClick={() => handleDelete(terminal.id)}
                        >
                          <TrashIcon className="w-5" />
                        </Button>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Fields>
      </FieldsWrapper>
    </div>
  );
}
