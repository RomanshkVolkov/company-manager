'use client';

import { useActionState } from 'react';
import { Checkbox, Input } from '@nextui-org/react';
import { AnimatePresence, motion } from 'framer-motion';
import { LockClosedIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { editUser } from '@/app/lib/actions/user.actions';
import { Errors } from '@/app/lib/schemas/user.schema';
import { hasItems } from '@/app/lib/utils';
import Fields from '@/app/ui/common/fields';
import FormWrapper from '../../common/form-wrapper';
import FormGroup from '../../common/form-group';
import InputSelect from '../../common/input-select';
import { ActionState, Catalog } from '@/app/types/types';
import { site } from '@/app/lib/consts';
import SelectCrud from '../../common/select-crud';
import { EditableUser } from '@/app/types/user';

export default function EditUserForm({
  profiles,
  shifts,
  kitchens,
  user,
}: {
  profiles: Catalog[];
  shifts: Catalog[];
  kitchens: Catalog[];
  user: EditableUser;
}) {
  const initialState: ActionState<Errors> = {
    message: '',
    errors: {} as Errors,
  };

  const bindAction = editUser.bind(null, user.id as number);
  const [state, dispatch] = useActionState(bindAction, initialState);

  return (
    <FormWrapper
      dispatch={dispatch}
      hrefCancelled={site.settings.users}
      message={state.message}
    >
      <FormGroup title="Información del usuario" icon={UserGroupIcon}>
        <Fields>
          <div className="mb-4 md:mb-0 md:w-1/2">
            <InputSelect
              id="profileID"
              label="Tipo de usuario"
              options={profiles}
              defaultValue={user?.profileID}
            />
          </div>
          <div className="mb-4 md:mb-0 md:w-1/2">
            <Input
              id="name"
              name="name"
              label="Nombre"
              isInvalid={hasItems(state.errors?.name)}
              errorMessage={state.errors?.name?.join(', ')}
              defaultValue={user?.name}
            />
          </div>
        </Fields>
        <Fields>
          <div className="mb-4 md:mb-0 md:w-1/2">
            <SelectCrud
              id="shiftID"
              label="Turno"
              hrefCrud={site.settings.modals.createShift}
              description="Opcional"
              options={shifts}
              defaultValue={user?.shiftID}
            />
          </div>
          <div className="mb-4 md:mb-0 md:w-1/2">
            <Input
              id="email"
              name="email"
              label="Correo electrónico"
              description="Con este correo podras recuperar tu contraseña."
              isInvalid={hasItems(state.errors?.email)}
              errorMessage={state.errors?.email?.join(', ')}
              defaultValue={user?.email}
            />
          </div>
        </Fields>
        <Fields>
          <div className="mb-4 md:mb-0 md:w-1/2">
            <SelectCrud
              id="kitchenIDs"
              label="Cocinas"
              hrefCrud={site.settings.modals.createKitchen}
              description="Opcional"
              options={kitchens}
              multiple={true}
              defaultValue={user?.kitchenIDs}
            />
          </div>
          <div className="flex w-full justify-end md:w-1/2">
            <label htmlFor="isActive">
              <span className="mr-2">Usuario activo</span>
              <Checkbox
                id="isActive"
                name="isActive"
                defaultChecked={!!user?.isActive}
                defaultSelected={!!user?.isActive}
              />
            </label>
          </div>
        </Fields>
      </FormGroup>

      <AnimatePresence mode="wait" initial={false}>
        <motion.fieldset
          key="credentials"
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: true ? 20 : 1,
            y: true ? 20 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <FormGroup title="Credenciales de acceso" icon={LockClosedIcon}>
            <Fields>
              <div className="mb-4 flex justify-end md:mb-0 md:w-1/2">
                <Input
                  id="username"
                  name="username"
                  label="Usuario"
                  required
                  isInvalid={hasItems(state.errors?.email)}
                  errorMessage={state.errors?.email?.join(', ')}
                  description="Este campo te identificará en el sistema."
                  defaultValue={user?.username}
                />
              </div>
            </Fields>
          </FormGroup>
        </motion.fieldset>
      </AnimatePresence>
    </FormWrapper>
  );
}
