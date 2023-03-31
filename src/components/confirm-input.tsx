import {useCallback, useEffect, useRef, useState} from 'react'
import CheckIcon from 'react:@assets/images/vector.svg'
import LoadingIcon from 'react:@assets/images/loading.svg'

import css from 'styled-jsx/css'

export default function ConfirmInput({
  command = '',
  placeholder = '',
  loading = false,
  disabled = false,
  autoFocus = true,
  onTextChange = text => null,
  onConfirm = command => null,
}) {
  const inputRef = useRef()
  const [isActive, setActive] = useState(false)
  const [value, setValue] = useState(command)

  const keydownHandler = useCallback(
    e => {
      if ((e.key === 'Enter' || e.keyCode === 13) && !e.repeat) {
        if (inputRef?.current) {
          onConfirm((inputRef.current as any).value)
        }
      }
    },
    [onConfirm]
  )

  useEffect(() => {
    return document.removeEventListener('keydown', keydownHandler)
  }, [keydownHandler])

  useEffect(() => {
    setValue(command)
  }, [command])

  const addKeydownEventListener = () => {
    setActive(true)
    document.addEventListener('keydown', keydownHandler)
  }

  const removeKeydownEventListener = () => {
    setActive(false)
    document.removeEventListener('keydown', keydownHandler)
  }

  const handleChangeInput = e => {
    const {value} = e.target
    setValue(value)
    onTextChange(value)
  }

  return (
    <section className={`confirm-input ${isActive && 'confirm-input--active'}`}>
      <input
        ref={inputRef}
        autoFocus={autoFocus}
        disabled={loading}
        placeholder={placeholder}
        className="input"
        onChange={handleChangeInput}
        onFocus={addKeydownEventListener}
        onBlur={removeKeydownEventListener}
        value={value}
      />
      <div className="confirm">
        <button
          disabled={loading}
          className={`send-btn ${isActive && (value !== '' || placeholder !== '') && 'active'} ${
            loading && 'loading'
          }`}
          onClick={() => onConfirm(value)}
        >
          {loading ? <LoadingIcon className="loading" /> : <CheckIcon className="icon" />}
        </button>
      </div>

      <style jsx>{styles}</style>
    </section>
  )
}

const styles = css`
  .confirm-input {
    position: relative;
    display: flex;
    border: 1px solid lightgray;
    border-radius: 5px;
    overflow: hidden;
    height: 32px;
    margin-top: 12px;
  }

  //TODO: Bug fix
  .confirm-input--active {
    border-bottom: 1px solid #2d5eae;
  }

  .input {
    display: block;
    width: 100%;
    padding: 0 12px;
    color: #777;
    font-size: 16px;
    line-height: 40px;
    border: none;
    outline: none;
    font-size: 12px;

    &::placeholder {
      font-size: 12px;
      color: #777777;
    }
  }

  .confirm {
    flex: none;
    width: 40px;

    .send-btn {
      width: 100%;
      height: 100%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      background-color: rgba(0, 0, 0, 0);
      fill: #dadada;

      &.active {
        fill: #2d5eae;
      }
      &.loading {
        cursor: not-allowed;
        animation: rotation 1s infinite linear;
      }
    }
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`
