import { Menu } from '@headlessui/react';
import { Command } from 'phosphor-react';
import { Fragment, ReactNode, useEffect, useState } from 'react';

interface IDropdown {
  button?: JSX.Element;
  buttonWrapper?: boolean;
  items: Array<
    Array<{ icon: JSX.Element; name: string; onClick: () => void; commands?: Array<string> }>
  >;
  position?: 'left' | 'center' | 'right';
  onContextMenu?: boolean;
}

const Dropdown = ({
  button,
  buttonWrapper,
  items,
  position = 'center',
  onContextMenu = false,
}: IDropdown) => {
  const [visible, setVisible] = useState(false);

  return (
    <Menu
      as="div"
      className="relative flex-1"
      onContextMenu={(e) => {
        if (onContextMenu) {
          e.preventDefault();
          setVisible((prev) => !prev);
        }
      }}
    >
      {({ open }) => (
        <>
          {button && (
            <Menu.Button
              as={buttonWrapper ? 'button' : 'div'}
              className={`${buttonWrapper && 'p-2 hover:bg-white/20 rounded-full cursor-pointer'}`}
            >
              {button}
            </Menu.Button>
          )}

          {(onContextMenu ? visible : open) && (
            <Menu.Items
              static
              className={`absolute overflow-hidden top-[calc(100%+0.5rem)] flex flex-col gap-y-2 rounded-lg py-2  bg-dark-background-elevation w-56 min-w-full ${
                position === 'right' && 'translate-x-full right-full'
              } ${position === 'center' && 'inset-x-1/2 -translate-x-1/2'} ${
                position === 'left' && '-translate-x-full left-full'
              }`}
            >
              {items.map((item, id) => (
                <div key={id} className="border-t border-white/10 pt-2 first:p-0 first:border-0">
                  {item.map((element, id) => (
                    <div key={id} className="px-2" onClick={element.onClick}>
                      <Menu.Item
                        as="div"
                        className="cursor-pointer flex items-center justify-between p-1 hover:bg-white/10 rounded"
                      >
                        <div className="flex items-center gap-x-2">
                          {element.icon}
                          <span>{element.name}</span>
                        </div>

                        {element.commands && (
                          <div className="flex gap-x-1 bg-dark-background-secondary px-2 items-center rounded">
                            <Command size={20} />
                            {element.commands?.map((command) => (
                              <>
                                <span>+</span>
                                <span className="uppercase">{command}</span>
                              </>
                            ))}
                          </div>
                        )}
                      </Menu.Item>
                    </div>
                  ))}
                </div>
              ))}
            </Menu.Items>
          )}
        </>
      )}
    </Menu>
  );
};

export default Dropdown;
