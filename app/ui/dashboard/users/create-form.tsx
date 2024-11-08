'use client';

// framework
import { useActionState, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// libs
import { Checkbox, Input } from '@nextui-org/react';
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

// types and utils
import { ActionState, Catalog } from '@/app/types/types';
import { Errors } from '@/app/lib/schemas/user.schema';
import { createUser } from '@/app/lib/actions/user.actions';
import { hasItems } from '@/app/lib/utils';
import { site } from '@/app/lib/consts';

// components
import Fields from '@/app/ui/common/fields';
import FormWrapper from '@/app/ui/common/form-wrapper';
import FormGroup from '@/app/ui/common/form-group';
import InputSelect from '@/app/ui/common/input-select';
import SelectCrud from '@/app/ui/common/select-crud';

export default function CreateUserForm({
  profiles,
  shifts,
  kitchens,
}: {
  profiles: Catalog[];
  shifts: Catalog[];
  kitchens: Catalog[];
}) {
  const initialState: ActionState<Errors> = {
    message: '',
    errors: {} as Errors,
  };
  const [state, dispatch] = useActionState(createUser, initialState);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <FormWrapper
      dispatch={dispatch}
      hrefCancelled={site.usersSettings.path}
      message={state.message}
    >
      <FormGroup title="Información del usuario" icon={UserGroupIcon}>
        <Fields>
          <div className="mb-4 md:mb-0 md:w-1/2">
            <InputSelect
              id="profileID"
              label="Tipo de usuario"
              options={profiles}
            />
          </div>
          <div className="mb-4 md:mb-0 md:w-1/2">
            <Input
              id="name"
              name="name"
              label="Nombre"
              isInvalid={hasItems(state.errors?.name)}
              errorMessage={state.errors?.name?.join(', ')}
            />
          </div>
        </Fields>
        <Fields>
          <div className="mb-4 md:mb-0 md:w-1/2">
            <SelectCrud
              id="shiftID"
              label="Turno"
              hrefCrud={site.createShift.path}
              description="Opcional"
              options={shifts}
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
            />
          </div>
        </Fields>
        <Fields>
          <div className="mb-4 md:mb-0 md:w-1/2">
            <SelectCrud
              id="kitchenIDs"
              label="Cocinas"
              hrefCrud={site.createKitchen.path}
              description="Opcional"
              options={kitchens}
              multiple={true}
            />
          </div>
          <div className="flex w-full justify-end md:w-1/2">
            <label htmlFor="isActive">
              <span className="mr-2">Usuario activo</span>
              <Checkbox
                id="isActive"
                name="isActive"
                defaultChecked={true}
                defaultValue={1}
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
                />
              </div>

              <div className="mb-4 flex justify-end md:mb-0 md:w-1/2">
                <Input
                  id="password"
                  name="password"
                  label="Contraseña"
                  type={isVisible ? 'text' : 'password'}
                  required
                  isInvalid={hasItems(state.errors?.password)}
                  errorMessage={state.errors?.password?.join(', ')}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeSlashIcon
                          className="pointer-events-none text-2xl text-default-400"
                          width={20}
                        />
                      ) : (
                        <EyeIcon
                          className="pointer-events-none text-2xl text-default-400"
                          width={20}
                        />
                      )}
                    </button>
                  }
                />
              </div>
            </Fields>
          </FormGroup>
        </motion.fieldset>
      </AnimatePresence>
    </FormWrapper>
  );
}
