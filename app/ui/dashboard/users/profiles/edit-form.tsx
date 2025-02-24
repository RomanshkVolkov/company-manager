'use client';
// framework
import React, { useActionState, useCallback } from 'react';

// libs
import { Checkbox, Input } from '@nextui-org/react';
import { ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/outline';

// types and utils
import { ActionState, Catalog } from '@/app/types/types';
import Fields from '@/app/ui/common/fields';
import FormGroup from '@/app/ui/common/form-group';
import { Permission, Profile } from '@/app/types/user';
import { editProfile } from '@/app/lib/actions/user.actions';
import { hasItems } from '@/app/lib/utils';

// components
import FormWrapper from '@/app/ui/common/form-wrapper';
import InputSelect from '@/app/ui/common/input-select';
import TableByRenderFunction from '@/app/ui/common/table-by-renderfunction';
import useEndActionModalProcess from '@/app/hooks/use-end-action-modal-process';

type Props = {
  profile: Profile;
  permissions: Permission[];
};
export default function EditProfileForm({ profile, permissions }: Props) {
  const [selectedPermissions, setSelectedPermissions] = React.useState<
    Permission[]
  >(profile.permissions);

  const initialState: ActionState<any> = {
    errors: {} as any,
    message: '',
    finishedProcess: false,
  };

  const bindAction = editProfile.bind(null, profile.id, selectedPermissions);
  const [state, dispatch] = useActionState(bindAction, initialState);
  useEndActionModalProcess({ signal: state?.finishedProcess });

  const defaultPermissions = useCallback(
    () => new Set(profile.permissions.map((p) => p.id.toString())),
    [profile]
  );

  const columns = React.useMemo(
    () => [
      {
        uid: 'name',
        name: 'Nombre',
      },
      {
        uid: 'writing',
        name: 'Escritura',
      },
      {
        uid: 'path',
        name: 'Ruta',
      },
    ],
    []
  );

  const renderFunction = (item: Permission, columnKey: 'writing' | 'name') => {
    const value = item[columnKey];

    switch (columnKey) {
      case 'writing':
        return (
          <Checkbox
            color="default"
            isSelected={item.writing}
            onChange={() => {
              setSelectedPermissions((prev) => {
                const permissionsMapped = prev.map((permission) => {
                  if (permission.id === item.id) {
                    return { ...permission, writing: !permission.writing };
                  }
                  return permission;
                });
                return permissionsMapped;
              });
            }}
          />
        );
      default:
        return value;
    }
  };

  const handleChanguePermissions = (value: string | Catalog) => {
    if (typeof value !== 'string') {
      return; // ts ignore always receive a string for multiple
    }

    const newValues =
      value.length > 1 ? value.split(',').map((id) => +id) : [+value];
    const newPermissions = permissions.filter((permission) =>
      newValues.includes(permission.id)
    );

    setSelectedPermissions((prev) => {
      const permissionsMapped = newPermissions.map((permission) => {
        const exist = prev.find((p) => p.id === permission.id);
        return exist || permission;
      });
      return permissionsMapped;
    });
  };

  return (
    <FormWrapper
      dispatch={dispatch}
      message={state.message}
      hrefCancelled="back()"
    >
      <FormGroup title="Datos del perfil" icon={UserCircleIcon}>
        <Fields>
          <div className="mb-4 w-full md:mb-0">
            <Input
              id="name"
              name="name"
              label="Nombre"
              defaultValue={profile.name}
              isInvalid={hasItems(state.errors?.name)}
              errorMessage={state.errors?.name}
            />
          </div>
        </Fields>
      </FormGroup>
      <FormGroup title="Permisos" icon={ShieldCheckIcon}>
        <Fields>
          <div className="mb-4 w-full md:mb-0">
            <InputSelect
              id="permissions"
              label="Permisos"
              className="max-w-[300px]"
              options={permissions}
              defaultValue={defaultPermissions()}
              multiple
              onChange={handleChanguePermissions}
            />
          </div>
        </Fields>
        <Fields>
          <div className="w-full max-w-full">
            <TableByRenderFunction
              columns={columns}
              data={selectedPermissions}
              renderFunction={renderFunction}
            />
          </div>
        </Fields>
      </FormGroup>
    </FormWrapper>
  );
}
