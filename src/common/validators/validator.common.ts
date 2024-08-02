import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsDob(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDob',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: `Please ${propertyName}  must be an dd-mm-yyy`,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          const regex =
            /^(0[1-9]|1\d|2[0-8]|29(?=-\d\d-(?!1[01345789]00|2[1235679]00)\d\d(?:[02468][048]|[13579][26]))|30(?!-02)|31(?=-0[13578]|-1[02]))-(0[1-9]|1[0-2])-([12]\d{3})$/;
          return regex.test(value);
        },
      },
    });
  };
}

